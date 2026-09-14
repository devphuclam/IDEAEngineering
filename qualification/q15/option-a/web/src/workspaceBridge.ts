import type { WorkspaceOperation, WorkspaceResult } from "./types";

interface WebViewTransport {
  postMessage(message: unknown): void;
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent) => void): void;
}

declare global {
  interface Window {
    chrome?: { webview?: WebViewTransport };
  }
}

type Pending = { resolve: (value: WorkspaceResult) => void; reject: (reason: Error) => void; timer: number };

export class WorkspaceBridge {
  private sessionId: string | null = null;
  private readonly pending = new Map<string, Pending>();
  private readonly listener = (event: MessageEvent) => this.receive(event.data);

  constructor(private readonly transport: WebViewTransport | undefined = window.chrome?.webview) {
    transport?.addEventListener("message", this.listener);
  }

  get available(): boolean { return this.transport !== undefined && this.sessionId !== null; }

  dispose(): void {
    this.transport?.removeEventListener("message", this.listener);
    for (const pending of this.pending.values()) {
      window.clearTimeout(pending.timer);
      pending.reject(new Error("Bridge disposed."));
    }
    this.pending.clear();
    this.sessionId = null;
  }

  async send(operation: WorkspaceOperation, payload: Record<string, string>, timeoutMs = 8_000): Promise<WorkspaceResult> {
    if (!this.transport || !this.sessionId) throw new Error("NATIVE_BRIDGE_UNAVAILABLE");
    validateIntent(operation, payload);
    const requestId = crypto.randomUUID();
    const message = { protocolVersion: "1.0", bridgeSessionId: this.sessionId, requestId, operation, payload };
    return await new Promise<WorkspaceResult>((resolve, reject) => {
      const timer = window.setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error("NATIVE_BRIDGE_TIMEOUT"));
      }, timeoutMs);
      this.pending.set(requestId, { resolve, reject, timer });
      this.transport!.postMessage(message);
    });
  }

  private receive(value: unknown): void {
    if (!value || typeof value !== "object") return;
    const message = value as Record<string, unknown>;
    if (message.type === "bridge.ready" && message.protocolVersion === "1.0" && typeof message.bridgeSessionId === "string") {
      this.sessionId = message.bridgeSessionId;
      window.dispatchEvent(new CustomEvent("q15-bridge-ready"));
      return;
    }
    if (message.type !== "bridge.result" || typeof message.requestId !== "string") return;
    const pending = this.pending.get(message.requestId);
    if (!pending) return;
    this.pending.delete(message.requestId);
    window.clearTimeout(pending.timer);
    pending.resolve(message.result as WorkspaceResult);
  }
}

export function validateIntent(operation: WorkspaceOperation, payload: Record<string, string>): void {
  const fields: Record<WorkspaceOperation, readonly string[]> = {
    GetWorkspaceStatus: [], OpenDocument: ["documentId", "generationId"], OpenFolder: ["documentId"],
    SelectFile: ["documentId", "artifactRole"], LaunchApprovedApplication: ["documentId", "generationId", "applicationCode"]
  };
  const expected = fields[operation];
  const actual = Object.keys(payload);
  if (actual.length !== expected.length || actual.some((name) => !expected.includes(name))) throw new Error("BRIDGE_PAYLOAD_SCHEMA");
  if (actual.some((name) => /path|command|shell/i.test(name))) throw new Error("BRIDGE_FORBIDDEN_PROXY");
  if (Object.values(payload).some((value) => !value || value.length > 128)) throw new Error("BRIDGE_PAYLOAD_BOUNDS");
}

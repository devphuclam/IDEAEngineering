import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, ApiProblem } from "./api";
import { t } from "./i18n";
import type { DocumentDetail, DocumentSummary, Locale, OperationStatus, ProfileName, SessionView, TreeNode, WorkspaceResult } from "./types";
import { VirtualGrid } from "./VirtualGrid";
import { VirtualTree } from "./VirtualTree";
import { WorkspaceBridge } from "./workspaceBridge";

function problemText(error: unknown): string {
  return error instanceof ApiProblem ? `${error.problem.code}: ${error.problem.detail}` : error instanceof Error ? error.message : String(error);
}

export default function App() {
  const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem("q15-locale") as Locale | null) ?? "en");
  const [session, setSession] = useState<SessionView | null>(null);
  const [username, setUsername] = useState("engineer");
  const [password, setPassword] = useState("");
  const [query, setQuery] = useState("pump");
  const [profile, setProfile] = useState<ProfileName>("large");
  const [rows, setRows] = useState<Map<number, DocumentSummary>>(() => new Map());
  const [total, setTotal] = useState(0);
  const [columns, setColumns] = useState<string[]>(Array.from({ length: 20 }, (_, i) => `field${String(i + 1).padStart(2, "0")}`));
  const [tree, setTree] = useState<Map<number, TreeNode>>(() => new Map());
  const [treeTotal, setTreeTotal] = useState(0);
  const [selected, setSelected] = useState(-1);
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "empty" | "ready" | "error">("idle");
  const [notice, setNotice] = useState("");
  const [scenario, setScenario] = useState("success");
  const [operation, setOperation] = useState<OperationStatus | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceResult | null>(null);
  const [bridgeReady, setBridgeReady] = useState(false);
  const [dataGeneration, setDataGeneration] = useState(0);
  const bridge = useMemo(() => new WorkspaceBridge(), []);
  const navigate = useNavigate();
  const location = useLocation();
  const loadedPages = useRef(new Set<string>());
  const generationRef = useRef(0);

  useEffect(() => {
    const ready = () => setBridgeReady(true);
    window.addEventListener("q15-bridge-ready", ready);
    const marker = window.requestAnimationFrame(() => {
      const login = document.querySelector<HTMLButtonElement>('[data-q15="login-submit"]');
      if (login && !login.disabled) {
        document.documentElement.dataset.q15UiReady = "true";
        document.documentElement.dataset.q15Ready = "true";
      }
    });
    return () => { window.removeEventListener("q15-bridge-ready", ready); window.cancelAnimationFrame(marker); bridge.dispose(); };
  }, [bridge]);
  useEffect(() => { localStorage.setItem("q15-locale", locale); document.documentElement.lang = locale; }, [locale]);

  const loadRows = useCallback(async (start: number) => {
    if (!session || total === 0) return;
    const offset = Math.floor(start / 200) * 200;
    const generation = generationRef.current;
    const requestQuery = query;
    const requestProfile = profile;
    const key = `${generation}|${requestQuery}|${requestProfile}|${offset}`;
    if (loadedPages.current.has(key)) return;
    loadedPages.current.add(key);
    try {
      const page = await api.search(requestQuery, requestProfile, offset, 200);
      if (generation !== generationRef.current) return;
      setRows((current) => { const next = new Map(current); page.items.forEach((item, index) => next.set(page.offset + index, item)); return next; });
    } catch (error) {
      loadedPages.current.delete(key);
      if (generation === generationRef.current) setNotice(problemText(error));
    }
  }, [profile, query, session, total]);

  const loadTree = useCallback(async (start: number) => {
    if (!session || treeTotal === 0) return;
    const offset = Math.floor(start / 500) * 500;
    const generation = generationRef.current;
    const requestProfile = profile;
    const key = `${generation}|tree|${requestProfile}|${offset}`;
    if (loadedPages.current.has(key)) return;
    loadedPages.current.add(key);
    try {
      const page = await api.tree(requestProfile, offset, 500);
      if (generation !== generationRef.current) return;
      setTree((current) => { const next = new Map(current); page.nodes.forEach((item, index) => next.set(page.offset + index, item)); return next; });
    } catch (error) {
      loadedPages.current.delete(key);
      if (generation === generationRef.current) setNotice(problemText(error));
    }
  }, [profile, session, treeTotal]);

  async function login(event: FormEvent) {
    event.preventDefault(); setStatus("loading"); setNotice("");
    try {
      const established = await api.login(username, password);
      setSession(established); setLocale(established.locale); setStatus("idle");
      navigate("/documents");
    } catch (error) { setStatus("error"); setNotice(problemText(error)); }
  }

  async function search(event?: FormEvent) {
    event?.preventDefault();
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    setDataGeneration(generation);
    setStatus("loading"); setNotice(""); setRows(new Map()); setTree(new Map()); setDetail(null); setSelected(-1); loadedPages.current.clear();
    try {
      const [page, treePage] = await Promise.all([api.search(query, profile, 0, 200), api.tree(profile, 0, 500)]);
      if (generation !== generationRef.current) return;
      setRows(new Map(page.items.map((item, index) => [page.offset + index, item])));
      setColumns(page.columns); setTotal(page.total);
      setTree(new Map(treePage.nodes.map((item, index) => [treePage.offset + index, item]))); setTreeTotal(treePage.total);
      setStatus(page.total === 0 ? "empty" : "ready");
    } catch (error) {
      if (generation !== generationRef.current) return;
      setTotal(0); setTreeTotal(0); setStatus("error"); setNotice(problemText(error));
    }
  }

  function changeProfile(next: ProfileName) {
    if (next === profile) return;
    generationRef.current += 1;
    setDataGeneration(generationRef.current);
    setProfile(next); setRows(new Map()); setTree(new Map()); setDetail(null); setSelected(-1);
    setTotal(0); setTreeTotal(0); loadedPages.current.clear();
  }

  async function open(index: number) {
    const row = rows.get(index);
    if (!row) { await loadRows(index); return; }
    setSelected(index); setStatus("loading");
    try { const next = await api.document(row.documentId); setDetail(next); setStatus("ready"); navigate(`/documents/${row.documentId}`); }
    catch (error) { setStatus("error"); setNotice(problemText(error)); }
  }

  async function checkout() {
    if (!detail) return; setNotice("");
    try {
      const result = await api.checkout(detail.documentId, detail.generationId, scenario);
      setOperation(result); setReservationId(result.reservationId);
      setNotice(result.status === "Committed" ? t(locale, "success") : t(locale, "uncertain"));
    } catch (error) { setNotice(problemText(error)); }
  }

  async function openWorkspace() {
    if (!detail) return; setNotice("");
    try {
      const result = await bridge.send("OpenDocument", { documentId: detail.documentId, generationId: detail.generationId });
      setWorkspace(result); setNotice(`${result.code} · ${result.preservesLocalCandidate ? t(locale, "preserved") : ""}`);
    } catch (error) { setNotice(error instanceof Error && error.message === "NATIVE_BRIDGE_UNAVAILABLE" ? t(locale, "bridgeUnavailable") : problemText(error)); }
  }

  async function checkin() {
    if (!detail || !reservationId) return;
    const digest = typeof workspace?.payload.digest === "string" ? workspace.payload.digest : "0".repeat(64);
    try {
      const result = await api.checkin(detail, reservationId, digest, scenario === "uncertain" ? "uncertain" : scenario === "failed" ? "failed" : "success");
      setOperation(result); setNotice(result.status === "Committed" ? t(locale, "success") : t(locale, "uncertain"));
    } catch (error) { setNotice(`${problemText(error)} · ${t(locale, "preserved")}`); }
  }

  async function refreshOperation() {
    if (!operation) return;
    try { const result = await api.operation(operation.operationId); setOperation(result); setNotice(result.status === "Committed" ? t(locale, "success") : t(locale, "uncertain")); }
    catch (error) { setNotice(problemText(error)); }
  }

  if (!session) return <main id="main" className="login-page">
    <form className="login-card" onSubmit={login} aria-labelledby="login-title">
      <span className="eyebrow">OPTION A · REACT WEB</span>
      <h1 id="login-title">{t(locale, "appTitle")}</h1>
      <p>{t(locale, "signInHint")}</p>
      <label>{t(locale, "username")}<input data-q15="login-username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} /></label>
      <label>{t(locale, "password")}<input data-q15="login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button data-q15="login-submit" type="submit" disabled={status === "loading"}>{t(locale, "login")}</button>
      <LocaleSelect locale={locale} setLocale={setLocale} />
      <p role="status" aria-live="polite">{notice}</p>
    </form>
  </main>;

  return <div className="app-shell">
    <header>
      <div><span className="eyebrow">OPTION A · {bridgeReady ? "WPF/WEBVIEW2" : "WEB"}</span><h1>{t(locale, "appTitle")}</h1></div>
      <div className="header-actions"><span>{session.displayName}</span><LocaleSelect locale={locale} setLocale={setLocale} /></div>
    </header>
    <main id="main">
      <form className="search-bar" onSubmit={search}>
        <label>{t(locale, "search")}<input data-q15="search-query" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <label>{t(locale, "profile")}<select data-q15="search-profile" value={profile} onChange={(event) => changeProfile(event.target.value as ProfileName)}>
          <option value="small">small</option><option value="medium">medium</option><option value="large">large</option><option value="stress">stress</option>
        </select></label>
        <button data-q15="search-submit">{t(locale, "searchAction")}</button>
      </form>
      <nav aria-label="Breadcrumb"><button onClick={() => { navigate("/documents"); setDetail(null); }}>Documents</button><span>/</span><span>{detail?.documentId ?? location.pathname}</span></nav>
      <div className="workspace-layout">
        <aside aria-labelledby="tree-heading"><h2 id="tree-heading">{t(locale, "tree")}</h2>
          <VirtualTree total={treeTotal} nodes={tree} onRange={(start) => void loadTree(start)} label={t(locale, "tree")} pagingKey={`${dataGeneration}|${profile}`} />
        </aside>
        <section className="browser" aria-labelledby="browser-heading"><h2 id="browser-heading">{t(locale, "browser")}</h2>
          {status === "loading" && <p role="status">{t(locale, "loading")}…</p>}
          {status === "empty" && <p role="status">{t(locale, "empty")}</p>}
          {status === "error" && <p role="alert">{t(locale, "error")}: {notice}</p>}
          {total > 0 && <VirtualGrid total={total} columns={columns} rows={rows} selected={selected} onSelected={setSelected}
            onOpen={(index) => void open(index)} onRange={(start) => void loadRows(start)} label={t(locale, "grid")}
            editLabel={t(locale, "inlineEdit")} menuLabel={t(locale, "contextMenu")} pagingKey={`${dataGeneration}|${query}|${profile}`} />}
        </section>
        <aside className="detail" aria-labelledby="detail-heading"><h2 id="detail-heading">{t(locale, "detail")}</h2>
          {!detail ? <p>{t(locale, "selectDocument")}</p> : <>
            <span data-q15="detail-state" className={`state ${detail.readOnly ? "muted" : ""}`}>{detail.state} {detail.readOnly && `· ${t(locale, "readOnly")}`}</span>
            <h3>{detail.title}</h3>
            <dl><div><dt>Stable ID</dt><dd>{detail.documentId}</dd></div><div><dt>Revision</dt><dd>{detail.revision}</dd></div>
              <div><dt>Version</dt><dd>{detail.version}</dd></div><div><dt>Generation</dt><dd>{detail.generationId}</dd></div>
              {Object.entries(detail.metadata).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
            <label>Scenario<select aria-label="Qualification scenario" value={scenario} onChange={(event) => setScenario(event.target.value)}>
              <option value="success">success</option><option value="conflict">conflict</option><option value="stale">stale</option>
              <option value="unauthorized">unauthorized</option><option value="uncertain">uncertain</option><option value="failed">failed</option>
            </select></label>
            <div className="command-stack">
              <button data-q15="checkout" onClick={() => void checkout()} disabled={detail.readOnly}>{t(locale, "checkout")}</button>
              <button data-q15="open-workspace" onClick={() => void openWorkspace()}>{t(locale, "openWorkspace")}</button>
              <button data-q15="checkin" onClick={() => void checkin()} disabled={!reservationId}>{t(locale, "startCheckin")}</button>
              <button data-q15="checkin-status" onClick={() => void refreshOperation()} disabled={!operation}>{t(locale, "checkinStatus")}</button>
            </div>
            {operation && <div data-q15="operation" className="operation" role="status"><strong>{operation.status}</strong><code>{operation.operationId}</code>
              <span>{operation.preservedLocalCandidate && t(locale, "preserved")}</span></div>}
          </>}
        </aside>
      </div>
      <div data-q15="notice" className="notice" role="status" aria-live="polite">{notice}</div>
    </main>
  </div>;
}

function LocaleSelect({ locale, setLocale }: { locale: Locale; setLocale(locale: Locale): void }) {
  return <label className="locale">{t(locale, "locale")}<select value={locale} onChange={(event) => setLocale(event.target.value as Locale)}>
    <option value="en">English</option><option value="vi">Tiếng Việt</option><option value="ja">日本語</option>
  </select></label>;
}

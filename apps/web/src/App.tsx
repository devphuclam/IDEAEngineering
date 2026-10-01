import { FormEvent, useEffect, useState } from "react";

type CsrfProof = { headerName: string; token: string };
type SessionView = { actorId: string; accountId: string };

async function readJson<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error("REQUEST_REFUSED");
  return response.json() as Promise<T>;
}

export function App() {
  const [csrf, setCsrf] = useState<CsrfProof | null>(null);
  const [session, setSession] = useState<SessionView | null>(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Đang kết nối IDEA Server…");
  const [busy, setBusy] = useState(false);

  const refreshSession = async () => {
    try {
      const proof = await readJson<CsrfProof>(await fetch("/api/v1/identity/csrf", {
        credentials: "include",
        headers: { Accept: "application/json" },
      }));
      setCsrf(proof);
      const current = await fetch("/api/v1/identity/session", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (current.ok) {
        setSession(await current.json() as SessionView);
        setMessage("Đã đăng nhập");
      } else {
        setSession(null);
        setMessage("Chưa đăng nhập");
      }
    } catch {
      setSession(null);
      setMessage("Không kết nối được IDEA Server");
    }
  };

  useEffect(() => {
    void refreshSession();
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!csrf || busy) return;
    setBusy(true);
    setMessage("Đang xác thực…");
    const submittedPassword = password;
    setPassword("");
    try {
      const body = new URLSearchParams({ username: login, password: submittedPassword });
      const response = await fetch("/api/v1/identity/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          [csrf.headerName]: csrf.token,
        },
        body,
      });
      if (!response.ok) throw new Error("LOGIN_REFUSED");
      setLogin("");
      await refreshSession();
    } catch {
      setMessage("Đăng nhập bị từ chối");
    } finally {
      setPassword("");
      setBusy(false);
    }
  };

  const submitLogout = async () => {
    if (!csrf || busy) return;
    setBusy(true);
    try {
      const response = await fetch("/api/v1/identity/logout", {
        method: "POST",
        credentials: "include",
        headers: { [csrf.headerName]: csrf.token },
      });
      if (!response.ok) throw new Error("LOGOUT_REFUSED");
      setSession(null);
      setMessage("Đã đăng xuất");
      await refreshSession();
    } catch {
      setMessage("Đăng xuất bị từ chối");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main aria-label="IDEA Engineering" data-testid="idea-web-app">
      <header>
        <h1>IDEA Engineering</h1>
        <p>Core v0 · Web qualification</p>
      </header>
      <p role="status" aria-live="polite">{message}</p>
      {session ? (
        <section aria-label="Phiên hiện tại">
          <p data-testid="session-actor">Actor: {session.actorId}</p>
          <button type="button" onClick={() => void submitLogout()} disabled={busy}>
            Đăng xuất
          </button>
        </section>
      ) : (
        <form aria-label="Đăng nhập" onSubmit={(event) => void submitLogin(event)}>
          <label>
            Login
            <input
              name="username"
              autoComplete="username"
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              disabled={busy}
              required
            />
          </label>
          <label>
            Mật khẩu
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={busy}
              required
            />
          </label>
          <button type="submit" disabled={busy || csrf === null}>Đăng nhập</button>
        </form>
      )}
    </main>
  );
}

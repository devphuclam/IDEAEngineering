import { FormEvent, useEffect, useState } from "react";
import { BrandShowcase } from "./components/auth/BrandShowcase";
import { LoginForm } from "./components/auth/LoginForm";
import { SessionLanding } from "./components/auth/SessionLanding";
import { BannerType } from "./components/auth/StatusBanner";
import { Topbar } from "./components/auth/Topbar";
import "./styles/auth.css";

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
  const [message, setMessage] = useState("Vui lòng nhập tài khoản và mật khẩu được cấp.");
  const [bannerType, setBannerType] = useState<BannerType>("neutral");
  const [busy, setBusy] = useState(false);

  // Dev preview mode state (enabled when offline or via ?dev=true)
  const [devMode, setDevMode] = useState(false);
  const [devScenario, setDevScenario] = useState("default");

  const refreshSession = async () => {
    try {
      const proof = await readJson<CsrfProof>(
        await fetch("/api/v1/identity/csrf", {
          credentials: "include",
          headers: { Accept: "application/json" },
        })
      );
      setCsrf(proof);
      const current = await fetch("/api/v1/identity/session", {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (current.ok) {
        setSession((await current.json()) as SessionView);
        setMessage("Đã đăng nhập");
        setBannerType("success");
      } else {
        setSession(null);
        setMessage("Vui lòng nhập tài khoản và mật khẩu được cấp.");
        setBannerType("neutral");
      }
    } catch {
      setSession(null);
      setMessage("Không thể kết nối đến máy chủ IDEA. Vui lòng kiểm tra lại đường truyền mạng.");
      setBannerType("danger");
      // Enable dev preview simulation toolbar when backend is offline
      setDevMode(true);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("dev=true")) {
      setDevMode(true);
    }
    void refreshSession();
  }, []);

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Dev preview simulation branch
    if (devMode && !csrf) {
      setBusy(true);
      setMessage("Đang kiểm tra thông tin đăng nhập...");
      setBannerType("neutral");
      setTimeout(() => {
        setBusy(false);
        if (login === "engineer.dev" || login === "admin" || login === "preview") {
          setSession({ actorId: login, accountId: "acc_019842a" });
          setBannerType("success");
        } else {
          setPassword("");
          setMessage("Đăng nhập không thành công: Tên đăng nhập hoặc mật khẩu không chính xác.");
          setBannerType("danger");
        }
      }, 500);
      return;
    }

    if (!csrf || busy) return;
    setBusy(true);
    setMessage("Đang kiểm tra thông tin đăng nhập...");
    setBannerType("neutral");
    const submittedPassword = password;
    setPassword("");
    try {
      const body = new URLSearchParams({
        username: login,
        password: submittedPassword,
      });
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
      setMessage("Đăng nhập không thành công: Tên đăng nhập hoặc mật khẩu không chính xác.");
      setBannerType("danger");
    } finally {
      setPassword("");
      setBusy(false);
    }
  };

  const submitLogout = async () => {
    if (devMode && !csrf) {
      setSession(null);
      setDevScenario("default");
      setMessage("Bạn đã đăng xuất khỏi phiên làm việc an toàn.");
      setBannerType("success");
      return;
    }

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
      setMessage("Bạn đã đăng xuất khỏi phiên làm việc an toàn.");
      setBannerType("success");
      await refreshSession();
    } catch {
      setMessage("Đăng xuất bị từ chối.");
      setBannerType("danger");
    } finally {
      setBusy(false);
    }
  };

  const setScenario = (sc: string) => {
    setDevScenario(sc);
    switch (sc) {
      case "default":
        setSession(null);
        setLogin("");
        setPassword("");
        setBusy(false);
        setMessage("Vui lòng nhập tài khoản và mật khẩu được cấp.");
        setBannerType("neutral");
        break;
      case "submitting":
        setSession(null);
        setLogin("engineer.dev");
        setPassword("••••••••");
        setBusy(true);
        setMessage("Đang kiểm tra thông tin đăng nhập...");
        setBannerType("neutral");
        break;
      case "wrong_password":
        setSession(null);
        setLogin("engineer.dev");
        setPassword("");
        setBusy(false);
        setMessage("Đăng nhập không thành công: Tên đăng nhập hoặc mật khẩu không chính xác.");
        setBannerType("danger");
        break;
      case "throttled":
        setSession(null);
        setLogin("engineer.dev");
        setPassword("");
        setBusy(false);
        setMessage("Tài khoản tạm thời bị khóa do nhập sai mật khẩu nhiều lần liên tiếp. Vui lòng thử lại sau 15 phút hoặc liên hệ quản trị viên.");
        setBannerType("warning");
        break;
      case "network_error":
        setSession(null);
        setBusy(false);
        setMessage("Không thể kết nối đến máy chủ IDEA. Vui lòng kiểm tra lại đường truyền mạng.");
        setBannerType("danger");
        break;
      case "authenticated":
        setSession({
          actorId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
          accountId: "872c524d-2ce6-4715-931a-c15785876baf",
        });
        setBusy(false);
        break;
    }
  };

  return (
    <main
      className="auth-viewport-root"
      aria-label="IDEA Engineering"
      data-testid="idea-web-app"
    >
      {/* Dev Preview Control Bar when offline or dev mode active */}
      {devMode && (
        <header
          className="dev-sim-bar"
          role="toolbar"
          aria-label="Thanh điều khiển kiểm thử giao diện"
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="dev-sim-badge">Dev Preview</span>
            <span>Kịch bản kiểm thử:</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "default" ? "active" : ""}`}
              onClick={() => setScenario("default")}
            >
              1. Mặc định
            </button>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "submitting" ? "active" : ""}`}
              onClick={() => setScenario("submitting")}
            >
              2. Đang gửi
            </button>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "wrong_password" ? "active" : ""}`}
              onClick={() => setScenario("wrong_password")}
            >
              3. Sai mật khẩu
            </button>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "throttled" ? "active" : ""}`}
              onClick={() => setScenario("throttled")}
            >
              4. Tạm khóa 15p
            </button>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "network_error" ? "active" : ""}`}
              onClick={() => setScenario("network_error")}
            >
              5. Mất kết nối
            </button>
            <button
              type="button"
              className={`dev-sim-btn ${devScenario === "authenticated" ? "active" : ""}`}
              onClick={() => setScenario("authenticated")}
            >
              6. Đã đăng nhập
            </button>
          </div>
        </header>
      )}

      {session ? (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <Topbar
            actorId={session.actorId}
            busy={busy}
            logoSrc="/logo-idea.png"
            onLogout={() => void submitLogout()}
          />
          <SessionLanding
            actorId={session.actorId}
            accountId={session.accountId}
            onEnterWorkbench={() =>
              alert("Chuyển đến Bàn làm việc Kỹ thuật CAD/PDM...")
            }
          />
        </div>
      ) : (
        <div className="auth-split-layout">
          <BrandShowcase sealSrc="/LOGO_IDEA_full_L.png" />
          <section className="auth-stage-container">
            <LoginForm
              username={login}
              password={password}
              busy={busy}
              statusMessage={message}
              statusType={bannerType}
              logoSrc="/logo-idea.png"
              onUsernameChange={setLogin}
              onPasswordChange={setPassword}
              onSubmit={(event) => void submitLogin(event)}
            />
          </section>
        </div>
      )}
    </main>
  );
}

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createIamClient, type AdministrationContext } from "./api/iamClient";
import { BrandShowcase } from "./components/auth/BrandShowcase";
import { LoginForm } from "./components/auth/LoginForm";
import { SessionLanding } from "./components/auth/SessionLanding";
import { StatusBanner, type BannerType } from "./components/auth/StatusBanner";
import { Topbar } from "./components/auth/Topbar";
import { AdminApp } from "./components/admin/AdminApp";
import { AccountAdministrationPage } from "./features/accountAdministration/AccountAdministrationPage";
import { ProjectAdministrationPage } from "./features/projectAdministration/ProjectAdministrationPage";
import { AssignmentWizard } from "./features/accessAdministration/AssignmentWizard";
import { CustomRoleEditor } from "./features/accessAdministration/CustomRoleEditor";
import { AccessInspectionPage } from "./features/accessInspection/AccessInspectionPage";
import { CredentialRedemptionPage } from "./features/credentials/CredentialRedemptionPage";
import { outcomeMessage } from "./features/iamIntegration/IamStatus";
import "./styles/auth.css";
import "./styles/admin.css";
import "./app/iam.css";
import "./ui/tokens/tokens.css";
import "./ui/primitives/primitives.css";
import { ComponentShowcase } from "./ui/showcase/ComponentShowcase";
import { RbacPilotPage } from "./features/accessAdministration/RbacPilotPage";
import { AppShell, NavItem } from "./ui/layout/AppShell";

const client = createIamClient();
const currentHash = () => typeof location !== "undefined" ? location.hash : "";
const currentRoute = () => {
  const hash = currentHash();
  if (hash === "#uikit") return "uikit";
  if (hash === "#rbac-pilot") return "rbac-pilot";
  if (hash === "#credentials") return "credentials";
  if (hash === "#accounts") return "accounts";
  if (hash === "#projects") return "projects";
  if (hash === "#rbac") return "rbac";
  if (hash === "#custom-role") return "custom-role";
  if (hash === "#access") return "access";
  return "session";
};

export function App() {
  const [route, setRoute] = useState(currentRoute);
  const [context, setContext] = useState<AdministrationContext | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("Đang kết nối IDEA Server…");
  const [statusType, setStatusType] = useState<BannerType>("neutral");
  const [busy, setBusy] = useState(false);
  const epoch = useRef(0);

  async function refresh() {
    const request = ++epoch.current;
    const result = await client.loadContext();
    if (request !== epoch.current) return;
    if (result.kind === "confirmed") {
      setContext(result.value); setMessage("Đã đăng nhập"); setStatusType("success");
    } else {
      setContext(null);
      setMessage(result.kind === "refused" && result.status === 401 ? "Chưa đăng nhập" : outcomeMessage(result));
      setStatusType(result.kind === "refused" && result.status === 401 ? "neutral" : "warning");
    }
  }

  useEffect(() => {
    const change = () => { setPassword(""); setRoute(currentRoute()); };
    window.addEventListener("hashchange", change); void refresh();
    return () => { epoch.current++; window.removeEventListener("hashchange", change); };
  }, []);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    epoch.current++;
    let submittedPassword = password;
    (event.currentTarget.elements.namedItem("password") as HTMLInputElement).value = "";
    setPassword(""); setBusy(true); setContext(null);
    setMessage("Đang xác thực…"); setStatusType("neutral");
    try {
      const result = await client.signIn(username, submittedPassword);
      if (result.kind === "confirmed") await refresh();
      else { setMessage(outcomeMessage(result)); setStatusType("warning"); }
    } finally { submittedPassword = ""; setBusy(false); }
  }

  async function signOut() {
    if (busy) return;
    epoch.current++; setPassword(""); setBusy(true); setContext(null);
    try {
      const result = await client.signOut();
      setMessage(result.kind === "confirmed" ? "Đã đăng xuất" : outcomeMessage(result));
      setStatusType(result.kind === "confirmed" ? "success" : "warning");
    } finally { setBusy(false); }
  }

  function invalidate() {
    epoch.current++; setContext(null); setPassword("");
    setMessage("Phiên không còn hợp lệ. Hãy đăng nhập lại."); setStatusType("warning");
  }
  const openAdmin = context?.actions.some(action=>action==="account.read"||action==="project.admin.read"||action==="role.catalogue.read"||action==="access.inspect"||action==="audit.read") ? () => { location.hash = context.actions.includes("account.read")?"accounts":context.actions.includes("project.admin.read")?"projects":context.actions.includes("role.catalogue.read")?"rbac":"access"; } : undefined;

const PaletteIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

  const uikitNavItems: NavItem[] = [
    ...(import.meta.env.DEV ? [{ id: "uikit", label: "UI Kit DevKit", href: "#uikit", active: route === "uikit", icon: <PaletteIcon /> }] : []),
    { id: "rbac-pilot", label: "Quản lý vai trò (RBAC)", href: "#rbac-pilot", active: route === "rbac-pilot", icon: <ShieldIcon /> },
    { id: "session", label: context ? "Phiên làm việc" : "Cổng đăng nhập", href: "#session", active: false, icon: <LockIcon /> },
  ];

  if (route === "uikit") {
    if (!import.meta.env.DEV) {
      return (
        <div style={{ padding: "48px 24px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
          <h2>Môi trường phát triển</h2>
          <p style={{ color: "var(--idea-color-text-muted)", margin: "12px 0 24px" }}>
            UI Kit DevKit chỉ khả dụng trong môi trường development preview.
          </p>
          <a href="#session" className="idea-btn idea-btn--primary" style={{ textDecoration: "none" }}>
            Về cổng đăng nhập
          </a>
        </div>
      );
    }
    return (
      <AppShell
        brandTitle="IDEA Engineering"
        brandSubtitle="DevKit v0.1"
        navItems={uikitNavItems}
      >
        <ComponentShowcase />
      </AppShell>
    );
  }

  if (route === "rbac-pilot") {
    return (
      <AppShell
        brandTitle="IDEA Engineering"
        brandSubtitle="RBAC Pilot"
        navItems={uikitNavItems}
      >
        <RbacPilotPage
          context={context}
          onInvalidated={invalidate}
          onNavigateBack={() => {
            location.hash = context ? "rbac" : "session";
          }}
        />
      </AppShell>
    );
  }

  if (route === "credentials") return <CredentialRedemptionPage />;
  if (context && (route === "accounts" || route === "projects" || route === "rbac" || route === "custom-role" || route === "access")) return (
    <AdminApp context={context} busy={busy} activeSection={route==="custom-role"?"rbac":route} onSelectSection={section=>{location.hash=section;}} onExitAdmin={() => { location.hash = "session"; }} onLogout={() => void signOut()}>
      {route==="accounts"?<AccountAdministrationPage context={context} onInvalidated={invalidate} />:route==="projects"?<ProjectAdministrationPage context={context} onInvalidated={invalidate} />:route==="custom-role"?<CustomRoleEditor context={context} onInvalidated={invalidate} />:route==="access"?<AccessInspectionPage context={context} onInvalidated={invalidate} />:<AssignmentWizard context={context} onInvalidated={invalidate} />}
    </AdminApp>
  );
  return (
    <div className="auth-viewport-root" data-testid="idea-web-app">
      {context ? <>
        <Topbar actorId={context.actorId} displayName={context.displayName} busy={busy} onLogout={() => void signOut()} onOpenAdmin={openAdmin} />
        <div className="session-status"><StatusBanner type={statusType} message={message} /></div>
        <SessionLanding actorId={context.actorId} accountId={context.accountId} organizationName={context.organizationName} onOpenAdmin={openAdmin} />
      </> : <main className="auth-split-layout">
        <BrandShowcase />
        <section className="auth-stage-container" aria-label="Đăng nhập IDEA">
          <div className="auth-stage-content">
            <LoginForm username={username} password={password} busy={busy} statusMessage={message} statusType={statusType}
              onUsernameChange={setUsername} onPasswordChange={setPassword} onSubmit={event => void signIn(event)} />
            <div className="auth-support-actions">
              <button type="button" className="admin-btn" disabled={busy} onClick={() => void refresh()}>Kiểm tra phiên</button>
              <a href="#credentials">Tôi có proof để thiết lập / reset credential</a>
              {import.meta.env.DEV && (
                <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                  <a href="#uikit" className="admin-btn" style={{ textDecoration: 'none' }}>UI Kit DevKit (Môi trường phát triển)</a>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>}
    </div>
  );
}

import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { BrandShowcase } from "../../components/auth/BrandShowcase";
import { LoginForm } from "../../components/auth/LoginForm";
import { SessionLanding } from "../../components/auth/SessionLanding";
import { AdminApp } from "../../components/admin/AdminApp";
import { AccountsView } from "../../components/admin/AccountsView";
import sealUrl from "../../assets/LOGO_IDEA_full_L.png";

const id = "00000000-0000-4000-8000-000000000046";
const noop = () => {};
describe("Authored UI connected to current authority", () => {
  it("keeps the IDEA brand/login screen and ordinary masked login control", () => {
    const html = renderToStaticMarkup(<><BrandShowcase /><LoginForm username="" password="" busy={false}
      statusMessage="Chưa đăng nhập" onUsernameChange={noop} onPasswordChange={noop} onSubmit={noop} /></>);
    expect(html).toContain("IDEA GROUP"); expect(html).toContain(sealUrl);
    expect(html).toContain("Cổng Đăng Nhập Kỹ Thuật"); expect(html).toContain('name="password"');
    expect(html).toContain('type="password"'); expect(html).not.toContain("dev-sim");
  });
  it("session landing uses recorded Organization without inventing Vault/workbench availability", () => {
    const html = renderToStaticMarkup(<SessionLanding actorId={id} accountId={id} organizationName="Synthetic Organization 46" />);
    expect(html).toContain("Synthetic Organization 46"); expect(html).not.toContain("icVault-Primary");
    expect(html).not.toContain("Vào Bàn Làm Việc"); expect(html).not.toContain("Mở Cổng Quản Trị");
  });
  it("retains administration navigation without fake counts or opening unfinished sections", () => {
    const html = renderToStaticMarkup(<AdminApp context={{actorId:id,accountId:id,organizationId:id,
      displayName:"Synthetic Custodian",organizationName:"Synthetic Organization 46",actions:["account.read"]}}
      busy={false} onExitAdmin={noop} onLogout={noop}><div>Actual accounts</div></AdminApp>);
    expect(html).toContain("IDEA DDM Administration"); expect(html).toContain("Actual accounts");
    expect(html).toContain("Synthetic Custodian"); expect(html).toContain("disabled=\"\"");
    expect(html).not.toContain("admin-nav-badge"); expect(html).not.toContain("Máy chủ IAM: Sẵn sàng");
  });
  it("unavailable accounts do not turn into an empty-success table or a create affordance", () => {
    const html = renderToStaticMarkup(<AccountsView accounts={null} filter="" busy={false} loading={false}
      canRead={false} canCreate={false} onFilterChange={noop} onSearch={noop} onReload={noop}
      onSelectAccount={noop} onOpenCreate={noop} status={<p>Không có quyền đọc</p>}>{null}</AccountsView>);
    expect(html).toContain("Không có quyền đọc"); expect(html).not.toContain("Tạo tài khoản</span>");
    expect(html).not.toContain("Không có Account phù hợp"); expect(html).not.toContain("<table");
  });
});

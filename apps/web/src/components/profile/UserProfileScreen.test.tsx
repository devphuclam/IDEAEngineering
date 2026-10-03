import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { UserProfileScreen } from "./UserProfileScreen";

describe("UserProfileScreen component", () => {
  it("renders user profile header, avatar, name, and identity codes", () => {
    const html = renderToStaticMarkup(
      createElement(UserProfileScreen, {
        actorId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
        accountId: "872c524d-2ce6-4715-931a-c15785876baf",
        onBack: () => {},
        onLogout: () => {},
      })
    );

    expect(html).toContain("Nguyễn Văn An");
    expect(html).toContain("Kỹ sư Cơ khí Chế tạo máy");
    expect(html).toContain("Phòng Thiết kế Cơ khí JIG &amp; Máy");
    expect(html).toContain("Mã kỹ sư (Actor ID):");
    expect(html).toContain("Mã tài khoản (Account ID):");
    expect(html).toContain("← Về Bàn Làm Việc");
  });

  it("renders 4 tab navigation items", () => {
    const html = renderToStaticMarkup(
      createElement(UserProfileScreen, {
        actorId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
        accountId: "872c524d-2ce6-4715-931a-c15785876baf",
        onBack: () => {},
        onLogout: () => {},
      })
    );

    expect(html).toContain("Thông tin cá nhân &amp; Thiết lập");
    expect(html).toContain("Vai trò &amp; Thẩm quyền kỹ thuật");
    expect(html).toContain("Dự án đang tham gia");
    expect(html).toContain("Bảo mật &amp; Lịch sử phiên");
  });

  it("renders personal info form fields in the default active tab", () => {
    const html = renderToStaticMarkup(
      createElement(UserProfileScreen, {
        actorId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
        accountId: "872c524d-2ce6-4715-931a-c15785876baf",
        onBack: () => {},
        onLogout: () => {},
      })
    );

    expect(html).toContain("Họ và tên kỹ sư:");
    expect(html).toContain("Tên đăng nhập hệ thống:");
    expect(html).toContain("Email công việc:");
    expect(html).toContain("Đổi mật khẩu tài khoản");
    expect(html).toContain("Lưu thay đổi hồ sơ");
  });
});

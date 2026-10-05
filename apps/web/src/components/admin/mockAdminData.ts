export interface AdminActor {
  id: string;
  username: string;
  fullName: string;
  email: string;
  department: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
  accountId?: string;
  loginIdentityId?: string;
  securityVersion?: number;
}

export interface AdminProject {
  id: string;
  code: string;
  name: string;
  lead: string;
  memberCount: number;
  vault: string;
  status: "active" | "archived";
}

export interface AdminRole {
  id: string;
  name: string;
  description: string;
  departments: string[];
  permissions: { action: string; description: string }[];
}

export interface AdminDepartment {
  id: string;
  code: string;
  name: string;
  lead: string;
  description: string;
  allowedRoleIds: string[];
  createdAt: string;
}

export const INITIAL_DEPARTMENTS: AdminDepartment[] = [
  {
    id: "dept_mech",
    code: "DEPT-MECH",
    name: "Phòng Thiết kế Cơ khí JIG & Máy",
    lead: "Nguyễn Văn An",
    description: "Chịu trách nhiệm thiết kế kết cấu cơ khí 3D, chi tiết đồ gá JIG và cây cấu trúc BOM dự án máy.",
    allowedRoleIds: ["role_design_engineer", "role_reviewer"],
    createdAt: "2026-01-01",
  },
  {
    id: "dept_elec",
    code: "DEPT-ELEC",
    name: "Phòng Điện - Tự động hóa",
    lead: "Đỗ Minh Quân",
    description: "Thiết kế sơ đồ nguyên lý điện, lập trình điều khiển PLC, cảm biến và mô phỏng cánh tay Robot.",
    allowedRoleIds: ["role_automation_engineer", "role_design_engineer"],
    createdAt: "2026-01-01",
  },
  {
    id: "dept_qa",
    code: "DEPT-QA",
    name: "Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật",
    lead: "Trần Bách Khoa",
    description: "Thẩm định dung sai, tiêu chuẩn kỹ thuật, phê duyệt phát hành Release và kiểm soát quy trình GD&T.",
    allowedRoleIds: ["role_reviewer"],
    createdAt: "2026-01-10",
  },
  {
    id: "dept_pmo",
    code: "DEPT-PMO",
    name: "Ban Quản lý Dự án (PMO)",
    lead: "Bùi Huy Hoàng",
    description: "Điều phối tiến độ, phân bổ nhân sự, kiểm soát mốc bàn giao dự án máy và nguồn lực sản xuất.",
    allowedRoleIds: ["role_project_admin"],
    createdAt: "2026-01-05",
  },
  {
    id: "dept_it",
    code: "DEPT-IT",
    name: "Ban Công nghệ & IT",
    lead: "Trần Minh Trí",
    description: "Quản trị hạ tầng máy chủ, hệ thống kho icVault, bảo mật định danh IAM và phần mềm bản quyền CAD.",
    allowedRoleIds: ["role_account_admin"],
    createdAt: "2026-01-01",
  },
];

export const ADMIN_DEPARTMENTS = INITIAL_DEPARTMENTS.map((d) => d.name);


export interface AdminGroup {
  id: string;
  code: string;
  name: string;
  department: string;
  memberCount: number;
  description: string;
}

export interface AdminRoleAssignment {
  id: string;
  principalId: string;
  principalName: string;
  principalType: "user" | "group";
  groupCode?: string;
  memberCount?: number;
  roleId: string;
  roleName: string;
  scope: string;
  assignmentType: "Direct" | "Inherited";
  assignedAt: string;
}

export const INITIAL_ACTORS: AdminActor[] = [
  {
    id: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
    username: "engineer.dev",
    fullName: "Nguyễn Văn An",
    email: "an.nguyen@ideagroupvn.com",
    department: "Phòng Thiết kế Cơ khí JIG & Máy",
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "34ba128a-7e11-4f90-bc42-998811223344",
    username: "linh.nguyen",
    fullName: "Nguyễn Thị Linh",
    email: "linh.nguyen@ideagroupvn.com",
    department: "Phòng Thiết kế Cơ khí JIG & Máy",
    status: "active",
    createdAt: "2026-02-01",
  },
  {
    id: "77cd4511-9a23-4e89-af12-ccddeeff0011",
    username: "nam.hoang",
    fullName: "Hoàng Nam",
    email: "nam.hoang@ideagroupvn.com",
    department: "Phòng Điện - Tự động hóa",
    status: "suspended",
    createdAt: "2026-02-18",
  },
  {
    id: "872c524d-2ce6-4715-931a-c15785876baf",
    username: "tri.minh",
    fullName: "Trần Minh Trí",
    email: "tri.minh@ideagroupvn.com",
    department: "Ban Công nghệ & IT",
    status: "active",
    createdAt: "2026-01-05",
  },
  {
    id: "a1b2c3d4-0001-4444-8888-111122223333",
    username: "quan.do",
    fullName: "Đỗ Minh Quân",
    email: "quan.do@ideagroupvn.com",
    department: "Phòng Điện - Tự động hóa",
    status: "active",
    createdAt: "2026-02-10",
  },
  {
    id: "a1b2c3d4-0002-4444-8888-111122223333",
    username: "binh.le",
    fullName: "Lê Thanh Bình",
    email: "binh.le@ideagroupvn.com",
    department: "Phòng Điện - Tự động hóa",
    status: "active",
    createdAt: "2026-02-12",
  },
  {
    id: "b2c3d4e5-0003-4444-8888-111122223333",
    username: "tuan.pham",
    fullName: "Phạm Quốc Tuấn",
    email: "tuan.pham@ideagroupvn.com",
    department: "Phòng Thiết kế Cơ khí JIG & Máy",
    status: "active",
    createdAt: "2026-02-15",
  },
  {
    id: "c3d4e5f6-0004-4444-8888-111122223333",
    username: "khoa.tran",
    fullName: "Trần Bách Khoa",
    email: "khoa.tran@ideagroupvn.com",
    department: "Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật",
    status: "active",
    createdAt: "2026-01-20",
  },
  {
    id: "d4e5f6a7-0005-4444-8888-111122223333",
    username: "thao.dang",
    fullName: "Đặng Thu Thảo",
    email: "thao.dang@ideagroupvn.com",
    department: "Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật",
    status: "active",
    createdAt: "2026-02-05",
  },
  {
    id: "e5f6a7b8-0006-4444-8888-111122223333",
    username: "hoang.bui",
    fullName: "Bùi Huy Hoàng",
    email: "hoang.bui@ideagroupvn.com",
    department: "Ban Quản lý Dự án (PMO)",
    status: "active",
    createdAt: "2026-01-25",
  },
];

export const INITIAL_PROJECTS: AdminProject[] = [
  {
    id: "proj_p100",
    code: "P-100",
    name: "Máy đóng gói tự động tốc độ cao",
    lead: "Nguyễn Văn An",
    memberCount: 8,
    vault: "icVault-Primary",
    status: "active",
  },
  {
    id: "proj_p200",
    code: "P-200",
    name: "Đồ gá hàn robot 6 trục cho khung xe điện",
    lead: "Trần Minh Trí",
    memberCount: 5,
    vault: "icVault-Primary",
    status: "active",
  },
  {
    id: "proj_p300",
    code: "P-300",
    name: "Cụm cấp phôi rung tự động linh kiện chính xác",
    lead: "Nguyễn Thị Linh",
    memberCount: 4,
    vault: "icVault-Primary",
    status: "active",
  },
];

export const INITIAL_ROLES: AdminRole[] = [
  {
    id: "role_design_engineer",
    name: "Design Engineer",
    departments: ["Phòng Thiết kế Cơ khí JIG & Máy", "Phòng Điện - Tự động hóa"],
    description: "Toàn quyền tạo mô hình, khóa Checkout, Check-in bản vẽ CAD và chỉnh sửa danh mục BOM dự án.",
    permissions: [
      { action: "cad.view", description: "Xem mô hình CAD 3D và bản vẽ 2D" },
      { action: "cad.checkout", description: "Khóa bản quyền (Checkout/Reservation) để chỉnh sửa" },
      { action: "cad.checkin", description: "Lưu phiên bản mới (Check-in Generation) lên icVault" },
      { action: "bom.edit", description: "Thêm bớt chi tiết trong cấu trúc cây BOM" },
    ],
  },
  {
    id: "role_automation_engineer",
    name: "Automation Engineer",
    departments: ["Phòng Điện - Tự động hóa"],
    description: "Thiết kế sơ đồ đấu nối điện, lập trình PLC, mô phỏng Robot và cập nhật linh kiện điện trong BOM.",
    permissions: [
      { action: "cad.view", description: "Xem mô hình CAD 3D và sơ đồ điện" },
      { action: "cad.checkout", description: "Khóa bản quyền (Checkout/Reservation) để chỉnh sửa" },
      { action: "cad.checkin", description: "Lưu phiên bản mới (Check-in Generation) lên icVault" },
      { action: "bom.edit", description: "Cập nhật linh kiện khí nén & cảm biến trong BOM" },
    ],
  },
  {
    id: "role_reviewer",
    name: "Reviewer / Approver",
    departments: ["Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật", "Phòng Thiết kế Cơ khí JIG & Máy"],
    description: "Thẩm duyệt thiết kế, kiểm tra va chạm mô hình lắp ráp, phê duyệt hoặc từ chối phát hành Release.",
    permissions: [
      { action: "cad.view", description: "Xem mô hình CAD và tài liệu kỹ thuật" },
      { action: "review.approve", description: "Ký duyệt chuyển trạng thái sang Released" },
      { action: "review.reject", description: "Từ chối phát hành kèm lý do yêu cầu sửa đổi" },
    ],
  },
  {
    id: "role_project_admin",
    name: "Project Administrator",
    departments: ["Ban Quản lý Dự án (PMO)"],
    description: "Quản lý nhân sự, phân nhóm kỹ sư và phân công vai trò trong phạm vi dự án máy được ủy quyền.",
    permissions: [
      { action: "project.members", description: "Thêm hoặc bớt thành viên trong dự án" },
      { action: "rbac.assign", description: "Gán vai trò Design Engineer hoặc Reviewer trong dự án" },
    ],
  },
  {
    id: "role_account_admin",
    name: "Account Administrator",
    departments: ["Ban Công nghệ & IT"],
    description: "Cấp tài khoản định danh Actor, quản lý trạng thái kích hoạt hoặc tạm dừng truy cập.",
    permissions: [
      { action: "account.create", description: "Tạo tài khoản kỹ sư mới" },
      { action: "account.suspend", description: "Tạm khóa hoặc mở khóa tài khoản" },
    ],
  },
];

export const INITIAL_GROUPS: AdminGroup[] = [
  {
    id: "grp_mech_1",
    code: "SG-MECH-01",
    name: "Phòng Thiết kế Cơ khí JIG & Máy",
    department: "Phòng Thiết kế Cơ khí JIG & Máy",
    memberCount: 8,
    description: "Tập hợp các kỹ sư thiết kế mô hình 3D, chi tiết máy, xuất bản vẽ 2D và quản lý cây BOM.",
  },
  {
    id: "grp_auto_elec",
    code: "SG-ELEC-02",
    name: "Phòng Điện - Tự động hóa",
    department: "Phòng Điện - Tự động hóa",
    memberCount: 5,
    description: "Nhóm kỹ sư lập trình PLC, Robot, sơ đồ điều khiển và tích hợp cảm biến công nghiệp.",
  },
  {
    id: "grp_qa_review",
    code: "SG-QA-STD",
    name: "Tổ Thẩm duyệt & Tiêu chuẩn Kỹ thuật",
    department: "Ban Quản lý Chất lượng",
    memberCount: 4,
    description: "Thẩm duyệt va chạm mô hình lắp ráp, kiểm tra dung sai và phê duyệt phát hành Release.",
  },
  {
    id: "grp_pmo",
    code: "SG-PMO-ADMIN",
    name: "Ban Quản lý Dự án (PMO)",
    department: "Khối Quản lý Dự án",
    memberCount: 3,
    description: "Điều phối tiến độ, phân bổ nguồn lực kỹ sư và giám sát các mốc bàn giao dự án máy.",
  },
];

export const INITIAL_ASSIGNMENTS: AdminRoleAssignment[] = [
  {
    id: "asg_001",
    principalId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
    principalName: "Nguyễn Văn An",
    principalType: "user",
    roleId: "role_project_admin",
    roleName: "Project Administrator",
    scope: "Dự án P-100",
    assignmentType: "Direct",
    assignedAt: "2026-01-16",
  },
  {
    id: "asg_002",
    principalId: "99fc203b-d303-4d3b-9a26-bdce8d4f725b",
    principalName: "Nguyễn Văn An",
    principalType: "user",
    roleId: "role_design_engineer",
    roleName: "Design Engineer",
    scope: "Dự án P-100",
    assignmentType: "Direct",
    assignedAt: "2026-01-16",
  },
  {
    id: "asg_003",
    principalId: "34ba128a-7e11-4f90-bc42-998811223344",
    principalName: "Nguyễn Thị Linh",
    principalType: "user",
    roleId: "role_design_engineer",
    roleName: "Design Engineer",
    scope: "Dự án P-100",
    assignmentType: "Direct",
    assignedAt: "2026-02-01",
  },
  {
    id: "asg_004",
    principalId: "c3d4e5f6-0004-4444-8888-111122223333",
    principalName: "Trần Bách Khoa",
    principalType: "user",
    roleId: "role_reviewer",
    roleName: "Reviewer / Approver",
    scope: "Dự án P-100",
    assignmentType: "Direct",
    assignedAt: "2026-01-20",
  },
  {
    id: "asg_005",
    principalId: "a1b2c3d4-0001-4444-8888-111122223333",
    principalName: "Đỗ Minh Quân",
    principalType: "user",
    roleId: "role_design_engineer",
    roleName: "Design Engineer",
    scope: "Dự án P-200",
    assignmentType: "Direct",
    assignedAt: "2026-02-10",
  },
  {
    id: "asg_006",
    principalId: "872c524d-2ce6-4715-931a-c15785876baf",
    principalName: "Trần Minh Trí",
    principalType: "user",
    roleId: "role_account_admin",
    roleName: "Account Administrator",
    scope: "Toàn hệ thống",
    assignmentType: "Direct",
    assignedAt: "2026-01-05",
  },
  {
    id: "asg_007",
    principalId: "34ba128a-7e11-4f90-bc42-998811223344",
    principalName: "Nguyễn Thị Linh",
    principalType: "user",
    roleId: "role_reviewer",
    roleName: "Reviewer / Approver",
    scope: "Dự án P-300",
    assignmentType: "Direct",
    assignedAt: "2026-02-10",
  },
];

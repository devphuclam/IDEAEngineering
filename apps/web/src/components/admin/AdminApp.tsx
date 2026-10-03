import { useState } from "react";
import { formatDisplayId } from "../../utils/identity";
import { AccountsView } from "./AccountsView";
import { AddRoleAssignmentDrawer } from "./AddRoleAssignmentDrawer";
import { AdminInspector } from "./AdminInspector";
import { AdminRail, AdminSection } from "./AdminRail";
import {
  AdminActor,
  AdminProject,
  AdminRoleAssignment,
  INITIAL_ACTORS,
  INITIAL_ASSIGNMENTS,
  INITIAL_PROJECTS,
  INITIAL_ROLES,
} from "./mockAdminData";
import { ProjectsView } from "./ProjectsView";
import { RbacView } from "./RbacView";
import "../../styles/admin.css";

export interface AdminAppProps {
  actorId: string;
  logoSrc?: string;
  onExitAdmin: () => void;
  onLogout: () => void;
}

export function AdminApp({
  actorId,
  logoSrc = "/logo-idea.png",
  onExitAdmin,
  onLogout,
}: AdminAppProps) {
  const [activeSection, setActiveSection] = useState<AdminSection>("accounts");

  // State collections
  const [actors, setActors] = useState<AdminActor[]>(INITIAL_ACTORS);
  const [projects] = useState<AdminProject[]>(INITIAL_PROJECTS);
  const [roles] = useState(INITIAL_ROLES);
  const [assignments, setAssignments] = useState<AdminRoleAssignment[]>(INITIAL_ASSIGNMENTS);

  // Selected entities for right-hand inspector
  const [selectedActor, setSelectedActor] = useState<AdminActor | null>(INITIAL_ACTORS[0]);
  const [selectedProject, setSelectedProject] = useState<AdminProject | null>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<AdminRoleAssignment | null>(null);

  // Drawer state
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [preselectedActorId, setPreselectedActorId] = useState<string | undefined>(undefined);

  // Toggle actor status (Active <-> Suspended)
  const handleToggleActorStatus = (id: string) => {
    setActors((prev) =>
      prev.map((actor) => {
        if (actor.id === id) {
          const newStatus = actor.status === "active" ? "suspended" : "active";
          const updated = { ...actor, status: newStatus as "active" | "suspended" };
          if (selectedActor?.id === id) {
            setSelectedActor(updated);
          }
          return updated;
        }
        return actor;
      })
    );
  };

  // Add new role assignment
  const handleAddAssignment = (newAsg: Omit<AdminRoleAssignment, "id" | "assignedAt">) => {
    const created: AdminRoleAssignment = {
      ...newAsg,
      id: `asg_${Date.now()}`,
      assignedAt: new Date().toISOString().split("T")[0],
    };
    setAssignments((prev) => [created, ...prev]);
    setSelectedAssignment(created);
    setActiveSection("rbac");
  };

  // Revoke assignment
  const handleRevokeAssignment = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
    if (selectedAssignment?.id === assignmentId) {
      setSelectedAssignment(null);
    }
  };

  const handleOpenAddRole = (forActorId?: string) => {
    setPreselectedActorId(forActorId);
    setIsAddRoleOpen(true);
  };

  const displayActor = formatDisplayId(actorId);

  return (
    <div className="admin-shell" aria-label="IDEA DDM Administration Console">
      {/* Row 1: Topbar (55px) */}
      <header className="admin-topbar">
        <div className="admin-topbar-brand">
          <img src={logoSrc} alt="IDEA Logo" className="admin-topbar-logo" />
          <div className="admin-topbar-title">
            <strong>IDEA DDM Administration</strong>
            <small>Cổng Quản Trị Hệ Thống &amp; Phân Quyền RBAC</small>
          </div>
        </div>

        <div className="admin-topbar-actions">
          <div className="actor-pill" title={`Quản trị viên: ${actorId}`}>
            <div className="pulse-dot" aria-hidden="true" />
            <span style={{ fontSize: "12px", color: "#cbd5e1" }}>
              Admin: <strong style={{ color: "#ffffff", fontFamily: "var(--font-mono)" }}>{displayActor}</strong>
            </span>
          </div>

          <button
            type="button"
            className="admin-btn"
            style={{ background: "#203b5c", color: "#ffffff", borderColor: "#476182" }}
            onClick={onExitAdmin}
          >
            ← Về Bàn Làm Việc Kỹ Thuật
          </button>

          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* Row 2: Menubar (32px) */}
      <nav className="admin-menubar" aria-label="Thanh tác vụ quản trị">
        <button type="button" className="admin-menu-item">Hệ thống</button>
        <button type="button" className="admin-menu-item">Quản trị</button>
        <button type="button" className="admin-menu-item">Bảo mật &amp; IAM</button>
        <button type="button" className="admin-menu-item">Trợ giúp</button>
        <div className="admin-menu-spacer" />
        <span className="admin-surface-badge">Phân hệ DDM Quản trị &bull; Microsoft Azure Parity</span>
      </nav>

      {/* Row 3: Workspace 3 Columns */}
      <main className="admin-workspace">
        {/* Col 1: Left Rail (238px) */}
        <AdminRail
          activeSection={activeSection}
          counts={{
            accounts: actors.length,
            projects: projects.length,
            assignments: assignments.length,
          }}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            if (sec === "accounts") {
              setSelectedActor(actors[0]);
              setSelectedProject(null);
              setSelectedAssignment(null);
            } else if (sec === "projects") {
              setSelectedProject(projects[0]);
              setSelectedActor(null);
              setSelectedAssignment(null);
            } else {
              setSelectedAssignment(assignments[0]);
              setSelectedActor(null);
              setSelectedProject(null);
            }
          }}
        />

        {/* Col 2: Center Main Content Stage */}
        {activeSection === "accounts" && (
          <AccountsView
            actors={actors}
            selectedActorId={selectedActor?.id}
            onSelectActor={(actor) => {
              setSelectedActor(actor);
              setSelectedProject(null);
              setSelectedAssignment(null);
            }}
            onOpenAddAccount={() => alert("Chức năng tạo tài khoản kỹ sư mới (F04)")}
          />
        )}

        {activeSection === "projects" && (
          <ProjectsView
            projects={projects}
            selectedProjectId={selectedProject?.id}
            onSelectProject={(proj) => {
              setSelectedProject(proj);
              setSelectedActor(null);
              setSelectedAssignment(null);
            }}
            onOpenAddProject={() => alert("Chức năng tạo dự án máy mới")}
          />
        )}

        {activeSection === "rbac" && (
          <RbacView
            assignments={assignments}
            roles={roles}
            actors={actors}
            projects={projects}
            selectedAssignmentId={selectedAssignment?.id}
            onSelectAssignment={(asg) => {
              setSelectedAssignment(asg);
              setSelectedActor(null);
              setSelectedProject(null);
            }}
            onOpenAddAssignment={() => handleOpenAddRole()}
          />
        )}

        {/* Col 3: Right Inspector (310px) */}
        <AdminInspector
          selectedActor={selectedActor}
          selectedProject={selectedProject}
          selectedAssignment={selectedAssignment}
          onToggleStatus={handleToggleActorStatus}
          onOpenAddRole={handleOpenAddRole}
          onRevokeAssignment={handleRevokeAssignment}
        />
      </main>

      {/* Row 4: Statusbar (27px) */}
      <footer className="admin-statusbar">
        <div className="admin-status-item">
          <span className="pulse-dot" style={{ width: 6, height: 6 }} aria-hidden="true" />
          <span>Máy chủ IAM: Sẵn sàng</span>
        </div>
        <div className="admin-status-item">
          <span>Kho lưu trữ: <strong>icVault-Primary</strong></span>
        </div>
        <div className="admin-status-spacer" />
        <div className="admin-status-item">
          <span>Phiên làm việc bảo mật &bull; Core C1 v0.14</span>
        </div>
      </footer>

      {/* 3-Step Wizard Flyout Drawer */}
      <AddRoleAssignmentDrawer
        isOpen={isAddRoleOpen}
        roles={roles}
        actors={actors}
        projects={projects}
        preselectedActorId={preselectedActorId}
        onClose={() => setIsAddRoleOpen(false)}
        onSubmit={handleAddAssignment}
      />
    </div>
  );
}

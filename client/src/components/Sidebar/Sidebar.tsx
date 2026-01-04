
const ROLES = ["all users", "admin", "moderator", "editor", "viewer"];

interface SidebarProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

export const SidebarUser = ({ selectedRole, onRoleSelect }: SidebarProps) => {
  return (
    <aside className="sidebar">
      {ROLES.map((role) => (
        <button
          key={role}
          className={`sidebar-item ${selectedRole === role ? "active" : ""}`}
          onClick={() => onRoleSelect(role)} 
        >
          {role}
        </button>
      ))}
    </aside>
  );
};
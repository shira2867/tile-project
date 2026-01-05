import style from './Sidebar.module.css'
const ROLES = ["all users", "admin", "moderator", "editor", "viewer"];

interface SidebarProps {
  selectedRole: string;
  onRoleSelect: (role: string) => void;
}

export const SidebarUser = ({ selectedRole, onRoleSelect }: SidebarProps) => {
  return (
    <aside className={style.sidebar}>
      {ROLES.map((role) => (
        <button
          key={role}
          className={`${style.sidebarItem} ${selectedRole === role ? style.active : ""}`}
          onClick={() => onRoleSelect(role)}
        >
          {role}
        </button>
      ))}
    </aside>
  );
};
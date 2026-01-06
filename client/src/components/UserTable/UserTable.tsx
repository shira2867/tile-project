import React from 'react';
import type { User } from '../../types/user.types';
import style from './UserTable.module.css'
interface UserTableProps {
  user: User;
  onRoleChange: (userId: string, newRole: User['role']) => void;
}

const UserTable: React.FC<UserTableProps> = ({ user, onRoleChange }) => {
  return (
    
      <div className={style.usertable}>
        <div className={style.cellname}>
          {user.name}
        </div>

        <div className={style.cellemail}>
          {user.email}
        </div>

        <div className={style.cellrole}>
          <select
            value={user.role}
            onChange={(e) => onRoleChange(user._id, e.target.value as User['role'])}
          >
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
      </div>
  );
};

export default UserTable;
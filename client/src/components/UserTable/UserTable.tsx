import React from 'react';
import { roles, type User } from '../../types/user.types';
import style from './UserTable.module.css'
interface UserTableProps {
  user: User;
  onRoleChange: (userId: string, newRole: User['role']) => void;
  disableRoleChange?: boolean; 
}

const UserTable: React.FC<UserTableProps> = ({ user, onRoleChange,disableRoleChange }) => {
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
      disabled={disableRoleChange}
      onChange={(e) =>
      onRoleChange(user._id, e.target.value as User["role"])
  }
     >
      {roles.map((role) => (
      <option key={role} value={role}>
       {role}
      </option>
       ))}
    </select>


        </div>
      </div>
  );
};

export default UserTable;
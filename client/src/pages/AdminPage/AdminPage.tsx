import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUser, getUsersByRole, updateUserRole } from "../../api/user"; 
import type { User } from '../../types/user.types';
import UserTable from "../../components/UserTable/UserTable";
import { SidebarUser } from "../../components/Sidebar/Sidebar";
import { useFooter } from "../../context/FooterContext"; 
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useUser } from '../../context/UserContext';
import style from './AdminPage.module.css'

export function AdminPage() {
  const queryClient = useQueryClient();
  const { setFooterActions } = useFooter();
  const currentUser = useUser();
  
  const [selectedRole, setSelectedRole] = useState("all users");
  const [pendingChanges, setPendingChanges] = useState<Record<string, User>>({});

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users", selectedRole],
    queryFn: () => {
      if (selectedRole === "all users") {
        return getAllUser();
      }
      return getUsersByRole(selectedRole);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (changes: User[]) => {
      return Promise.all(changes.map(user => updateUserRole(user._id, user.role)));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] }); 
      setPendingChanges({}); 
      alert("השינויים נשמרו בהצלחה!");
    },
    onError: (error) => {
      console.error("Save failed:", error);
      alert("אירעה שגיאה בשמירת הנתונים");
    }
  });

  const handleSave = useCallback(() => {
    const changesToSave = Object.values(pendingChanges);
    if (changesToSave.length === 0) return;
    mutate(changesToSave);
  }, [pendingChanges, mutate]);

  const handleUndo = useCallback(() => {
    setPendingChanges({});
  }, []);

  useEffect(() => {
    setFooterActions({
      onSave: handleSave,
      onUndo: handleUndo, 
      disabled: Object.keys(pendingChanges).length === 0 || isPending, 
    });

    return () => setFooterActions({ onSave: null, onUndo: null, disabled: false });
  }, [pendingChanges, isPending, handleSave, handleUndo, setFooterActions]);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    const originalUser = users.find(u => u._id === userId);
    if (!originalUser) return;

    setPendingChanges(prev => ({
      ...prev,
      [userId]: { ...originalUser, role: newRole }
    }));
  };

  return (
    <>
      <Header />
      <div className={style.pageWrapper}> 
        <div className={style.mainContent}> 
          
          <SidebarUser
            selectedRole={selectedRole}
            onRoleSelect={setSelectedRole}
          />

          <div className={style.tableContainer}>
            <div className={style.tableHeader}>
              <span className={style.headerCell}>USER</span>
              <span className={style.headerCell}>EMAIL</span>
              <span className={style.headerCell}>ROLE</span>
            </div>
            
            <div className={style.containerUser}>
              {isLoading ? (
                <div>טוען משתמשים...</div>
              ) : isError ? (
                <div>אירעה שגיאה בטעינת המשתמשים</div>
              ) : (
                users.map((user) => {
                  const displayUser = pendingChanges[user._id] || user;
                  const isSelf = user._id === currentUser?._id;

                  return (
                    <UserTable
                      key={user._id}
                      user={displayUser}
                      onRoleChange={handleRoleChange}
                      disableRoleChange={isSelf}
                    />
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
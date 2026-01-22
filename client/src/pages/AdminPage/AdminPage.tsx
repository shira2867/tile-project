import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUser, updateUserRole } from "../../api/user";
import type { User } from "../../types/user.types";
import UserTable from "../../components/UserTable/UserTable";
import { SidebarUser } from "../../components/Sidebar/Sidebar";
import { useFooter } from "../../context/FooterContext";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import { useUser } from "../../context/UserContext";
import style from "./AdminPage.module.css";
import { usersSchema } from "../../validation/userSchema";
import {
  handleSuccessNotification,
  handleErrorNotification,
} from "../../constants/message";
export function AdminPage() {
  const queryClient = useQueryClient();
  const { registerActions } = useFooter();
  const currentUser = useUser();

  const [selectedRole, setSelectedRole] = useState("all users");
  const [pendingChanges, setPendingChanges] = useState<Record<string, User>>(
    {},
  );

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: getAllUser,
  });
  const filteredUsers =
    selectedRole === "all users"
      ? users
      : users.filter((user) => user.role === selectedRole);

  const updateUsersRoleMutation = useMutation({
    mutationFn: async (changes: User[]) => {
      const parseResult = usersSchema.safeParse(changes);
      if (!parseResult.success) {
        console.error("Validation failed:", parseResult.error);
        throw new Error("נתונים לא תקינים");
      }
      return Promise.all(
        parseResult.data.map((user) => updateUserRole(user._id, user.role)),
      );
    },

    onSuccess: (updatedUsers) => {
      queryClient.setQueryData<User[]>(["users"], (old = []) =>
        old.map((user) => {
          const updated = updatedUsers.find((u) => u._id === user._id);
          return updated ? { ...user, ...updated } : user;
        }),
      );

      setPendingChanges({});
      handleSuccessNotification("השינויים נשמרו בהצלחה!");
    },
    onError: (error) => {
      console.error("Save failed:", error);
      handleErrorNotification("אירעה שגיאה בשמירת הנתונים");
    },
  });

  const handleSave = useCallback(async () => {
    const changesToSave = Object.values(pendingChanges);
    if (changesToSave.length === 0) return;

    await updateUsersRoleMutation.mutateAsync(changesToSave);
  }, [pendingChanges, updateUsersRoleMutation]);

  const handleUndo = useCallback(() => {
    setPendingChanges({});
  }, []);

  useEffect(() => {
    registerActions({
      onSave: handleSave,
      onUndo: handleUndo,
      hasChanges: Object.keys(pendingChanges).length > 0,
      isLoading: updateUsersRoleMutation.isPending,
    });

    return () =>
      registerActions({
        onSave: async () => {},
        onUndo: () => {},
        hasChanges: false,
      });
  }, [
    pendingChanges,
    updateUsersRoleMutation.isPending,
    handleSave,
    handleUndo,
    registerActions,
  ]);

  const handleRoleChange = (userId: string, newRole: User["role"]) => {
    const originalUser = users.find((u) => u._id === userId);
    if (!originalUser) return;
    setPendingChanges((prev) => ({
      ...prev,
      [userId]: { ...originalUser, role: newRole },
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
              <span className={style.headerCell}>user</span>
              <span className={style.headerCell}>email</span>
              <span className={style.headerCell}>role</span>
            </div>

            <div className={style.containerUser}>
              {isLoading ? (
                <div>טוען משתמשים...</div>
              ) : isError ? (
                <div>אירעה שגיאה בטעינת המשתמשים</div>
              ) : (
                filteredUsers.map((user) => {
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

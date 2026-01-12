import React, { useEffect, useState } from 'react';
import { useContext } from "react";
import { getAvatarUri } from "../../utils/utils";
import style from './Header.module.css'
import { useUser } from '../../context/UserContext';

import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../api/auth';
import { getUsersByEmail } from '../../api/user';
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useUser();
  const shouldShowImage = () => userContext.role === "admin";

  
  const avatarUri = getAvatarUri();

  const [email, setEmail] = useState<string | null>(null);


  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getCurrentUser();
        const currentUser = res.data;
        console.log("currentUser", currentUser.email);
        setEmail(currentUser.email);
      } catch (err) {
        console.error("Error loading user:", err);
      }
    };


    loadUser();
  }, []);
  useEffect(() => {
    if (!email) return;

    const loadUserDetails = async () => {
      try {
        const userResponse = await getUsersByEmail(email);
        if (userResponse.length > 0) {
          const { name, role, _id } = userResponse[0];
          userContext.setName(name);
          userContext.setRole(role);
          userContext.setId(_id);
        }
      } catch (err) {
        console.error("Error loading user details:", err);
      }
    };

    loadUserDetails();
  }, [email, userContext]);

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className={style.header}>
      <div className={style.details}>
        <div className={style.avatar} onClick={handleLogout}>
          <img src={avatarUri} alt="user" style={{ width: '24px' }} />

        </div>
        <div className={style.textWrapper}>
          <p className={style.name}>{userContext.name}</p>
          <p className={style.role}>{userContext.role}</p>
        </div>
      </div>
      <div className={style.rightIcons}>
        {shouldShowImage() &&
          <button
            className={`${style.headerButton1} ${location.pathname === '/admin' ? style.active : ''}`}
            onClick={() => navigate("/admin")}
          >
            <div className={style.icon1}>
              <img src="../../../public/profile.png" alt="pic1" style={{ width: '24px' }} />
            </div>
          </button>}
        <button
          className={`${style.headerButton2} ${location.pathname === '/tiles' ? style.active : ''}`}
          onClick={() => navigate("/tiles")}
        >
          <div className={style.icon2}>
            <img src="../../../public/copy.png" alt="pic2" style={{ width: '24px' }} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
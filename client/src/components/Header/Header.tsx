import  { useEffect } from 'react';

import { getAvatarUri } from "../../utils/utils";
import style from './Header.module.css'
import { useUser } from '../../context/UserContext';

import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser, logout } from '../../api/auth';
const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userContext = useUser();
  const shouldShowImage = () => userContext.role === "admin";

  
  const avatarUri = getAvatarUri();



useEffect(() => {
  const loadUser = async () => {
    try {
      const res = await getCurrentUser();
      const currentUser = res.data;
      console.log("currentUser",currentUser)

      if (currentUser) {
        userContext.setName(currentUser.name);
        userContext.setRole(currentUser.role);
        userContext.setId(currentUser._id);
      }
    } catch (err) {
      navigate('/login')
      console.error("Error loading user:", err);
    }
  };

  loadUser();
}, []);


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
          <img src={avatarUri} alt="user" />

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
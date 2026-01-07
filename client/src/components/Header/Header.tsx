import React from 'react';
import { useContext } from "react";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { toPng } from '@dicebear/converter';

import style from './Header.module.css'
import { UserContext, useUser } from '../../context/UserContext';
import { negative } from 'zod';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
const Header = () => {
  const navigate = useNavigate();

  const userContext = useUser();
  const shouldShowImage = () => userContext.role === "admin";
  console.log("header")

const avatar = createAvatar(lorelei, {
 
});
const avatarUri = avatar.toDataUri();
  return (
    <div className={style.header}>
      <div className={style.details}>
        <div className={style.avatar}>
          <img src={avatarUri} alt="user" style={{ width: '24px' }} />

        </div>
        <div className={style.textWrapper}>
          <p className={style.name}>{userContext.name}</p>
          <p className={style.role}>{userContext.role}</p>
        </div>
      </div>
      <div className={style.rightIcons}>
        {shouldShowImage() &&
          <button className={style.headerButton1} onClick={() => navigate("/admin")}>
            <div className={style.icon1}>
              <img src="../../../public/profile.png" alt="pic1" style={{ width: '24px' }} />
            </div>
          </button>}
        <button className={style.headerButton2} onClick={() => navigate("/tiles")}>
          <div className={style.icon2}>
            <img src="../../../public/copy.png" alt="pic2" style={{ width: '24px' }} />
          </div>
        </button>
      </div>
    </div>
  );
};

export default Header;
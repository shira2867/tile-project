import React from 'react';
import  { useContext } from "react";

import style from './Header.module.css'
import { UserContext, useUser } from '../../context/UserContext';
const Header = () => {

  const userContext = useUser();
   
  return (
    <div className={style.header}>
        <div className={style.details}>
            <div className={style.avatar}>
          <img src="../../../public/user (1).png" alt="user" style={{width: '24px'}} />
            </div>
         <div className={style.textWrapper}>
          <p className={style.name}>{userContext.name}</p>
          <p className={style.role}>{userContext.role}</p>
         </div>
        </div>
        <div className={style.rightIcons}>
            <div className={style.icon1}>
              <img  src="../../../public/profile.png" alt="pic1" style={{width: '24px'}} />
            </div>
            <div className={style.icon2}>
               <img src="../../../public/copy.png" alt="pic2" style={{width: '24px'}} />
            </div>
      </div>
    </div>
  );
};

export default Header;
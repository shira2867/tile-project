// import React from 'react';
// import { useFooter } from '../../context/FooterContext'; 
// import style from './Footer.module.css';

// const Footer = () => {
//   const { footerActions } = useFooter();
//   const { onSave, onUndo, disabled } = footerActions;

//   return (
//     <footer className={style.footerContainer}>
//       {onUndo && (
//         <button 
//           className={style.undoButton} 
//           onClick={onUndo} 
//           disabled={disabled}
//         >
//           UNDO
//         </button>
//       )}
//       {onSave && (
//         <div className={style.saveContainer}>
//           <button 
//             className={style.saveButton} 
//             onClick={onSave} 
//             disabled={disabled}
//           >
//             SAVE
//           </button>
//         </div>
//       )}
//     </footer>
//   );
// };

// export default Footer;

import { useFooter } from '../../context/FooterContext'; 
import style from './Footer.module.css';

const Footer = () => {
  const { canSave, canUndo, triggerSave, triggerUndo } = useFooter();

  return (
    
    <footer className={style.footerContainer}>
      {triggerUndo && (
        <button 
          className={style.undoButton} 
          onClick={triggerUndo} 
          disabled={!canUndo}
        >
          UNDO
        </button>
      )}
      {triggerSave && (
        <div className={style.saveContainer}>
          <button 
            className={style.saveButton} 
            onClick={triggerSave} 
          disabled={!canSave}
          >
            SAVE
          </button>
        </div>
      )}
    </footer>
  );

};

export default Footer;


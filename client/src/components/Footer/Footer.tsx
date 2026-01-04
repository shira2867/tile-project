import React from 'react';
import { useFooter } from '../../context/FooterContext'; 

const Footer: React.FC = () => {
  const { footerActions, setFooterActions } = useFooter();

  const { onSave, onUndo, disabled } = footerActions;

  return (
    <footer className="footer-container">
      {onUndo && (
        <button onClick={onUndo} disabled={disabled}>
          Undo
        </button>
      )}
      {onSave && (
        <button onClick={onSave} disabled={disabled}>
          Save Changes
        </button>
      )}
    </footer>
  );
};

export default Footer;
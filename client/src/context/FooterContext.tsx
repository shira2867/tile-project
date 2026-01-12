import React, { createContext, useState, useContext,type ReactNode, type FC } from 'react';
import type {FooterContextType,FooterProviderProps} from '../types/footerContext.type'


export const FooterContext = createContext<FooterContextType | null>(null);
export const useFooter = () => {
  const contextFooter = useContext(FooterContext);
  if (!contextFooter) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return contextFooter;
};
export const FooterProvider = ({ children }: FooterProviderProps) => {
  const [footerActions, setFooterActions] = useState({
    onSave: null,
    onUndo: null,
    disabled: false,
  });

  return (
    <FooterContext.Provider value={{ footerActions, setFooterActions }}>
      {children}
    </FooterContext.Provider>
  );
};



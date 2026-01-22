// import React, { createContext, useState, useContext,type ReactNode, type FC } from 'react';
// import type {FooterContextType,FooterProviderProps} from '../types/footerContext.type'


// export const FooterContext = createContext<FooterContextType | null>(null);
// export const useFooter = () => {
//   const contextFooter = useContext(FooterContext);
//   if (!contextFooter) {
//     throw new Error('useFooter must be used within a FooterProvider');
//   }
//   return contextFooter;
// };
// export const FooterProvider = ({ children }: FooterProviderProps) => {
//   const [footerActions, setFooterActions] = useState({
//     onSave: null,
//     onUndo: null,
//     disabled: false,
//   });

//   return (
//     <FooterContext.Provider value={{ footerActions, setFooterActions }}>
//       {children}
//     </FooterContext.Provider>
//   );
// };


import { createContext, useState, useContext, useCallback, useRef } from 'react';
import type { FooterContextType, FooterProviderProps, FooterRegistration } from '../types/footerContext.type';

export const FooterContext = createContext<FooterContextType | null>(null);

export const useFooter = () => {
  const contextFooter = useContext(FooterContext);
  if (!contextFooter) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return contextFooter;
};

export const FooterProvider = ({ children }: FooterProviderProps) => {
const actionsRef = useRef<{ 
  onSave: () => Promise<void> | void; 
  onUndo: () => void; 
} | null>(null);  
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);

  const registerActions = useCallback((data: FooterRegistration) => {
    actionsRef.current = { onSave: data.onSave, onUndo: data.onUndo };
    setHasChanges(data.hasChanges);
    setIsPageLoading(!!data.isLoading);
  }, []);

  const triggerSave = async () => {
    const currentReg = actionsRef.current;
    if (!currentReg?.onSave || isProcessing) return;
    setIsProcessing(true);
    try {
      await currentReg.onSave(); 
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerUndo = useCallback(() => {
    actionsRef.current?.onUndo();
  }, []);

  const canSave = hasChanges && !isProcessing && !isPageLoading;
  const canUndo = hasChanges && !isProcessing;

  return (
    <FooterContext.Provider 
      value={{ canSave, canUndo, isProcessing, registerActions, triggerSave, triggerUndo }}
    >
      {children}
    </FooterContext.Provider>
  );
};

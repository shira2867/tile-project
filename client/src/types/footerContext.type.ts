
// import { type ReactNode } from 'react';


// export type FooterActions ={
//   onSave: (() => void) | null;
//   onUndo: (() => void) | null;
//   disabled: boolean;
// }

// export type FooterContextType= {
//   footerActions: FooterActions;
//   setFooterActions: any;
// }

// export type FooterProviderProps= {
//   children: ReactNode;
// }

import { type ReactNode } from 'react';

export type FooterRegistration = {
 onSave: () => Promise<void> | void; 
  onUndo: () => void;
  hasChanges: boolean;
  isLoading?: boolean;           
}

export type FooterContextType = {
  canSave: boolean;
  canUndo: boolean;
  isProcessing: boolean;
  registerActions: (data: FooterRegistration) => void;
  triggerSave: () => Promise<void>;
  triggerUndo: () => void;
}

export type FooterProviderProps = {
  children: ReactNode;
}
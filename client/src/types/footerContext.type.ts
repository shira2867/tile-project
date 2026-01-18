
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


export type FooterActions ={
  onSave: (() => void) | null;
  onUndo: (() => void) | null;
  disabled: boolean;
}

export type FooterContextType= {
  footerActions: FooterActions;
  setFooterActions: any;
}

export type FooterProviderProps= {
  children: ReactNode;
}
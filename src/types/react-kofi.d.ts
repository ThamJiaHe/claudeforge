declare module 'react-kofi' {
  import { ComponentType } from 'react';

  interface KoFiButtonProps {
    username: string;
    label?: string;
    preset?: string;
    backgroundColor?: string;
  }

  interface KoFiWidgetProps {
    username: string;
    attachOnScroll?: boolean;
  }

  export const KoFiButton: ComponentType<KoFiButtonProps>;
  export const KoFiWidget: ComponentType<KoFiWidgetProps>;
  export const KoFiDialog: ComponentType<any>;
  export const KoFiPanel: ComponentType<any>;
}

declare module 'react-kofi/dist/kofi.css';
declare module 'react-kofi/dist/styles.css';

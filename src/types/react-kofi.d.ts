declare module 'react-kofi' {
  import { ComponentType } from 'react';

  interface KoFiButtonProps {
    id: string;
    label?: string;
    color?: string;
    size?: string;
    radius?: string;
  }

  interface KoFiWidgetProps {
    id: string;
    label?: string;
    color?: string;
    textColor?: string;
    attachOnScroll?: boolean;
  }

  export const KoFiButton: ComponentType<KoFiButtonProps>;
  export const KoFiWidget: ComponentType<KoFiWidgetProps>;
  export const KoFiDialog: ComponentType<any>;
  export const KoFiPanel: ComponentType<any>;
}

declare module 'react-kofi/dist/kofi.css';
declare module 'react-kofi/dist/styles.css';

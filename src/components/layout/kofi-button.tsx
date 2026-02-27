'use client';

import { KoFiButton as KoFiBtn } from 'react-kofi';
import 'react-kofi/dist/kofi.css';

export function KofiButton() {
  return (
    <KoFiBtn
      username="thamjiahe"
      label="Support"
      preset="thin"
      backgroundColor="kofiGrey"
    />
  );
}

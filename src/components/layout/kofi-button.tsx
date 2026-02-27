'use client';

import { KofiButton as KofiBtn } from 'react-kofi';
import 'react-kofi/dist/button.css';

export function KofiButton() {
  return (
    <KofiBtn
      username="thamjiahe"
      label="Support"
      preset="thin"
      backgroundColor="kofiGrey"
    />
  );
}

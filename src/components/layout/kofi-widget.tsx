'use client';

import { FloatingWidget } from 'react-kofi';
import 'react-kofi/dist/widget.css';

export function KofiWidget() {
  return (
    <FloatingWidget
      username="thamjiahe"
      attachOnScroll={true}
    />
  );
}

import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'ClaudeForge — Craft perfect Claude prompts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background:
            'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
            }}
          >
            ClaudeForge
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              fontWeight: 400,
              letterSpacing: '0.01em',
            }}
          >
            Craft perfect Claude prompts from plain English
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

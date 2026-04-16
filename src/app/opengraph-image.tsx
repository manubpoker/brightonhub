import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Brighton Hub — Real-time civic data for Brighton & Hove';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'linear-gradient(135deg, #0a0e1a 0%, #0e1b33 45%, #0a3a52 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '18px',
              background: 'rgba(56, 189, 248, 0.18)',
              border: '2px solid #38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '44px',
            }}
          >
            🌊
          </div>
          <div
            style={{
              fontSize: '36px',
              fontWeight: 700,
              letterSpacing: '-0.02em',
            }}
          >
            brightonhub.ai
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div
            style={{
              fontSize: '88px',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              maxWidth: '900px',
            }}
          >
            Live civic data for Brighton & Hove
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 400,
              color: '#94a3b8',
              maxWidth: '900px',
            }}
          >
            Environment · Weather · Crime · Transport · Planning · Health · Housing
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '22px',
            color: '#64748b',
          }}
        >
          <span>Real-time UK government open data, one dashboard</span>
          <span style={{ color: '#38bdf8', fontWeight: 600 }}>brightonhub.ai</span>
        </div>
      </div>
    ),
    { ...size }
  );
}

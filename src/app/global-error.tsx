'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error boundary:', error);
  }, [error]);

  return (
    <html lang="en-GB">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#0a0e1a',
          color: '#ffffff',
        }}
      >
        <div style={{ maxWidth: '520px', textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.75rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#94a3b8',
              marginBottom: '0.75rem',
            }}
          >
            Brighton Hub
          </p>
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              letterSpacing: '-0.02em',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            An unexpected error interrupted the page. You can try again or head
            back to the homepage.
          </p>
          {error?.digest && (
            <p
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                marginBottom: '1.5rem',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
              }}
            >
              Reference: {error.digest}
            </p>
          )}
          <div
            style={{
              display: 'flex',
              gap: '0.75rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              onClick={() => reset()}
              style={{
                background: '#38bdf8',
                color: '#0a0e1a',
                border: 'none',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <Link
              href="/"
              style={{
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.2)',
                padding: '0.625rem 1.25rem',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Go home
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

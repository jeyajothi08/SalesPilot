/**
 * AIAvatar — WebGL Orb with CSS animated fallback.
 *
 * CRITICAL FIX: The Three.js Canvas crashes the React tree when WebGL is
 * unavailable (sandboxed browser, blocked GPU, VMs). This version:
 * 1. Checks WebGL availability before attempting render.
 * 2. Wraps the Canvas in a React Error Boundary.
 * 3. Falls back to a CSS-animated orb so the rest of the UI stays functional.
 */
import React, { Suspense, Component, lazy, useState } from 'react';

// ── CSS Fallback Orb (zero WebGL dependency) ──────────────────────────────────
const CSSOrb = ({ state = 'idle' }) => {
  const cfg = {
    idle:      { border: 'border-purple-500/60', glow: 'bg-purple-500/20',  dot: 'bg-purple-400'  },
    listening: { border: 'border-blue-500/60',   glow: 'bg-blue-500/20',    dot: 'bg-blue-400'    },
    thinking:  { border: 'border-yellow-500/60', glow: 'bg-yellow-500/20',  dot: 'bg-yellow-400'  },
    speaking:  { border: 'border-green-500/60',  glow: 'bg-green-500/20',   dot: 'bg-green-400'   },
  };
  const c = cfg[state] ?? cfg.idle;
  return (
    <div className="relative flex items-center justify-center w-full h-full min-h-20">
      <div className={`absolute w-20 h-20 rounded-full border-2 ${c.border} animate-ping opacity-30`} />
      <div className={`absolute w-16 h-16 rounded-full ${c.glow} blur-xl`} />
      <div className={`relative w-12 h-12 rounded-full border-2 ${c.border} ${c.glow} flex items-center justify-center shadow-lg`}>
        <div className={`w-3 h-3 rounded-full ${c.dot} ${state !== 'idle' ? 'animate-pulse' : ''}`} />
      </div>
    </div>
  );
};

// ── Lazy-loaded WebGL canvas (only imported if WebGL is available) ─────────────
const WebGLOrb = lazy(() =>
  import('./WebGLOrb').catch(() => ({ default: CSSOrb }))
);

// ── Error boundary to catch Three.js runtime crashes ──────────────────────────
class WebGLBoundary extends Component {
  state = { crashed: false };

  static getDerivedStateFromError() {
    return { crashed: true };
  }

  componentDidCatch(err) {
    if (!String(err?.message).includes('WebGL')) {
      console.error('[AIAvatar] Unexpected render error:', err);
    }
  }

  render() {
    if (this.state.crashed) {
      return <CSSOrb state={this.props.state} />;
    }
    return this.props.children;
  }
}

// ── Runtime WebGL feature check ───────────────────────────────────────────────
function checkWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

// ── Public component ──────────────────────────────────────────────────────────
export const AIAvatar = ({ state = 'idle', className = '' }) => {
  const [webGLOk] = useState(checkWebGL);

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient glow */}
      <div
        className={`absolute inset-0 blur-3xl opacity-20 transition-colors duration-1000 ${
          state === 'speaking'  ? 'bg-green-500'  :
          state === 'listening' ? 'bg-blue-500'   :
          'bg-purple-500'
        }`}
      />

      {webGLOk ? (
        <WebGLBoundary state={state}>
          <Suspense fallback={<CSSOrb state={state} />}>
            <WebGLOrb state={state} />
          </Suspense>
        </WebGLBoundary>
      ) : (
        <CSSOrb state={state} />
      )}
    </div>
  );
};

/**
 * WebGLOrb — the Three.js canvas orb.
 * Loaded lazily by AIAvatar only when WebGL is available.
 */
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EnvironmentSetup } from '../3d/EnvironmentSetup';
import { EnhancedAIOrb } from '../3d/EnhancedAIOrb';

const WebGLOrb = ({ state = 'idle' }) => (
  <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 45 }}>
    <Suspense fallback={null}>
      <EnvironmentSetup />
      <EnhancedAIOrb state={state} />
    </Suspense>
  </Canvas>
);

export default WebGLOrb;

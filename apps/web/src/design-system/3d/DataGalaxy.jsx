import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const DataGalaxy = ({ count = 3000, radius = 5 }) => {
  const pointsRef = useRef();

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    
    const color1 = new THREE.Color('#3b82f6'); // Blue
    const color2 = new THREE.Color('#f59e0b'); // Gold/Revenue

    for (let i = 0; i < count; i++) {
      // Golden ratio spiral distribution
      const r = Math.random() * radius;
      const theta = r * 8; // Spiral tightness
      const y = (Math.random() - 0.5) * (1 - r/radius) * 2; // Thicker in middle

      pos[i * 3] = r * Math.cos(theta) + (Math.random() - 0.5) * 0.5;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = r * Math.sin(theta) + (Math.random() - 0.5) * 0.5;

      // Color mapping: Core is golden, edges are blue
      const mixedColor = color1.clone().lerp(color2, 1 - (r / radius));
      col[i * 3] = mixedColor.r;
      col[i * 3 + 1] = mixedColor.g;
      col[i * 3 + 2] = mixedColor.b;
    }
    
    return [pos, col];
  }, [count, radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      // Gentle tilt
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1 + 0.2;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

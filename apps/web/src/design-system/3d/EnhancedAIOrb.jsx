import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Sparkles } from '@react-three/drei';


export const EnhancedAIOrb = ({ state = 'thinking' }) => {
  const coreRef = useRef();
  const auraRef = useRef();

  useFrame((stateObj) => {
    const t = stateObj.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.3;
      coreRef.current.rotation.z = t * 0.2;
    }
    if (auraRef.current) {
      auraRef.current.rotation.y = -t * 0.1;
      // Pulse effect based on AI state
      const pulseSpeed = state === 'speaking' ? 4 : state === 'listening' ? 1 : 2;
      const scale = 1.6 + Math.sin(t * pulseSpeed) * 0.05;
      auraRef.current.scale.set(scale, scale, scale);
    }
  });

  const getColors = () => {
    switch (state) {
      case 'speaking': return { core: '#10b981', aura: '#34d399' }; // Green
      case 'listening': return { core: '#3b82f6', aura: '#60a5fa' }; // Blue
      default: return { core: '#8b5cf6', aura: '#a78bfa' }; // Purple (Thinking/Idle)
    }
  };

  const colors = getColors();
  const distortSpeed = state === 'speaking' ? 4 : state === 'listening' ? 1 : 2;
  const distortAmount = state === 'thinking' ? 0.6 : 0.4;

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      
      {/* Outer Distorting Liquid Glass */}
      <Sphere ref={coreRef} args={[1, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color={colors.aura}
          attach="material"
          distort={distortAmount}
          speed={distortSpeed}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.6}
          transmission={0.9}
          thickness={1}
          envMapIntensity={2}
        />
      </Sphere>
      
      {/* Inner Solid Glowing Core */}
      <Sphere ref={auraRef} args={[0.8, 32, 32]}>
        <meshStandardMaterial 
          color={colors.core}
          emissive={colors.core}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </Sphere>

      {/* Orbiting Particles */}
      <Sparkles 
        count={200} 
        scale={4} 
        size={2} 
        speed={0.4} 
        opacity={0.5} 
        color={colors.core} 
      />

    </Float>
  );
};

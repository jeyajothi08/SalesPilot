import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const VoiceWave = ({ barCount = 64, radius = 2, color = '#10b981' }) => {
  const meshRef = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Audio simulation data array
  const audioData = useRef(new Array(barCount).fill(0));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Simulate audio reactivity (this would be replaced by real WebAudio API data)
    for (let i = 0; i < barCount; i++) {
       // Create a complex wave pattern that looks like voice
       const wave1 = Math.sin(t * 5 + i * 0.2) * 0.5 + 0.5;
       const wave2 = Math.sin(t * 3 - i * 0.1) * 0.5 + 0.5;
       const randomJitter = Math.sin(t * 10 + i * Math.PI) * 0.2;
       audioData.current[i] = THREE.MathUtils.lerp(
         audioData.current[i], 
         Math.max(0.1, (wave1 * wave2) + randomJitter), 
         0.1
       );
    }

    // Update instanced mesh
    for (let i = 0; i < barCount; i++) {
      const angle = (i / barCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const height = audioData.current[i] * 3; // Scale height based on "audio"

      dummy.position.set(x, height / 2 - 1.5, z);
      
      // Look away from center to form a cylinder
      dummy.lookAt(0, height / 2 - 1.5, 0);
      
      dummy.scale.set(0.1, height, 0.05); // Width, Height, Depth
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    
    // Slowly rotate the entire cylinder
    meshRef.current.rotation.y = t * 0.2;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, barCount]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={1}
        transparent 
        opacity={0.8} 
        roughness={0.2}
      />
    </instancedMesh>
  );
};

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const NeuralNetwork = ({ nodeCount = 50, connectionDistance = 2 }) => {
  const pointsRef = useRef();
  const linesRef = useRef();

  // Generate random positions for nodes
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    const vel = [];
    for (let i = 0; i < nodeCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      
      vel.push(new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02
      ));
    }
    return [pos, vel];
  }, [nodeCount]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const pos = pointsRef.current.geometry.attributes.position.array;
    const linePositions = [];
    const lineColors = [];

    // Move nodes
    for (let i = 0; i < nodeCount; i++) {
      let x = pos[i * 3] + velocities[i].x;
      let y = pos[i * 3 + 1] + velocities[i].y;
      let z = pos[i * 3 + 2] + velocities[i].z;

      // Bounce off invisible boundary
      if (Math.abs(x) > 5) velocities[i].x *= -1;
      if (Math.abs(y) > 5) velocities[i].y *= -1;
      if (Math.abs(z) > 5) velocities[i].z *= -1;

      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }

    // Calculate connections
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dx = pos[i * 3] - pos[j * 3];
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
        const distSq = dx*dx + dy*dy + dz*dz;

        if (distSq < connectionDistance * connectionDistance) {
          const alpha = 1.0 - Math.sqrt(distSq) / connectionDistance;
          
          linePositions.push(
            pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2],
            pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]
          );
          
          // Blue to Purple gradient for lines
          lineColors.push(
            0.23, 0.51, 0.96, alpha, // #3b82f6
            0.57, 0.2, 0.91, alpha   // #9333ea
          );
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    linesRef.current.geometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 4));
  });

  return (
    <group>
      {/* Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={nodeCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.1} color="#ffffff" transparent opacity={0.8} />
      </points>
      
      {/* Connections */}
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial vertexColors transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
    </group>
  );
};

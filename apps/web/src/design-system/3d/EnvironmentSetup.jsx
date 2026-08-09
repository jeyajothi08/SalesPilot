import React from 'react';
import { Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei';

export const EnvironmentSetup = ({ enableControls = false, cameraPosition = [0, 0, 8] }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={cameraPosition} fov={45} />
      
      {/* Global Illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Primary Blue Highlight */}
      <directionalLight position={[10, 10, 5]} intensity={2} color="#3b82f6" castShadow />
      
      {/* Secondary Purple Rim Light */}
      <directionalLight position={[-10, -10, -5]} intensity={1.5} color="#9333ea" />
      
      {/* Fill Light */}
      <pointLight position={[0, -5, 5]} intensity={0.5} color="#ffffff" />
      
      {/* Soft studio reflections */}
      <Environment preset="studio" />

      {enableControls && (
        <OrbitControls 
          enablePan={false} 
          enableZoom={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 3}
        />
      )}
    </>
  );
};

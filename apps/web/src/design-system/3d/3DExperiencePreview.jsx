import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { EnvironmentSetup } from './EnvironmentSetup';
import { EnhancedAIOrb } from './EnhancedAIOrb';
import { NeuralNetwork } from './NeuralNetwork';
import { VoiceWave } from './VoiceWave';
import { DataGalaxy } from './DataGalaxy';
import { Card } from '../molecules/Card';

const ThreeDExperiencePreview = () => {
  const [activeScene, setActiveScene] = useState('orb');
  const [dpr, setDpr] = useState(1.5); // Dynamic pixel ratio for performance

  const scenes = [
    { id: 'orb', label: 'AI Core (Liquid Glass)' },
    { id: 'neural', label: 'Neural Memory Graph' },
    { id: 'voice', label: 'Live Voice Wave' },
    { id: 'galaxy', label: 'Revenue Data Galaxy' },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-ds-accent selection:text-white pb-32">
      
      {/* 3D Viewport */}
      <div className="relative w-full h-[60vh] bg-black border-b border-white/10 overflow-hidden">
         <Canvas dpr={dpr}>
           <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
           <Suspense fallback={null}>
             
             <EnvironmentSetup enableControls />
             
             {activeScene === 'orb' && <EnhancedAIOrb state="thinking" />}
             {activeScene === 'neural' && <NeuralNetwork nodeCount={100} />}
             {activeScene === 'voice' && <VoiceWave barCount={64} />}
             {activeScene === 'galaxy' && <DataGalaxy count={5000} />}
             
           </Suspense>
         </Canvas>

         {/* Overlay UI */}
         <div className="absolute top-6 left-6 pointer-events-none">
            <h2 className="text-3xl font-extrabold tracking-tight text-white mb-1">
              SalesPilot <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Vision</span>
            </h2>
            <p className="text-sm font-medium text-white/50 tracking-wider uppercase">WebGL Experience Engine</p>
         </div>

         <div className="absolute bottom-6 left-6 right-6 flex justify-center pointer-events-none">
            <div className="glass-card bg-black/40 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full flex gap-4 pointer-events-auto shadow-2xl">
               {scenes.map(scene => (
                 <button
                   key={scene.id}
                   onClick={() => setActiveScene(scene.id)}
                   className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                     activeScene === scene.id 
                       ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' 
                       : 'text-white/60 hover:text-white hover:bg-white/10'
                   }`}
                 >
                   {scene.label}
                 </button>
               ))}
            </div>
         </div>
      </div>

      {/* Description Section */}
      <div className="max-w-6xl mx-auto mt-16 px-12">
        <h3 className="text-2xl font-bold mb-8">Component Architecture</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <Card variant="glass" className="bg-white/5 border-white/10 text-white">
              <h4 className="font-bold mb-2">EnhancedAIOrb</h4>
              <p className="text-sm text-white/60">Uses MeshDistortMaterial and transmission properties to create a refractive liquid glass core. Emits particles based on AI state.</p>
           </Card>
           <Card variant="glass" className="bg-white/5 border-white/10 text-white">
              <h4 className="font-bold mb-2">NeuralNetwork</h4>
              <p className="text-sm text-white/60">High-performance custom WebGL lines that dynamically draw connections between floating vectors based on proximity.</p>
           </Card>
           <Card variant="glass" className="bg-white/5 border-white/10 text-white">
              <h4 className="font-bold mb-2">VoiceWave</h4>
              <p className="text-sm text-white/60">An instanced mesh cylinder that simulates real-time audio reactivity. Designed to map directly to WebAudio API frequency data.</p>
           </Card>
           <Card variant="glass" className="bg-white/5 border-white/10 text-white">
              <h4 className="font-bold mb-2">DataGalaxy</h4>
              <p className="text-sm text-white/60">A golden-ratio particle system using AdditiveBlending. Replaces boring 2D charts to visualize massive datasets like global revenue.</p>
           </Card>
        </div>
      </div>

    </div>
  );
};

export default ThreeDExperiencePreview;

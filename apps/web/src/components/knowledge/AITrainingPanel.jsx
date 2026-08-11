import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, FileText, CheckCircle, BrainCircuit, Activity, RotateCcw } from 'lucide-react';

const AITrainingPanel = () => {
  const [trainingState, setTrainingState] = useState('idle'); // idle, training, complete
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (trainingState === 'training') {
      let currentProgress = 0;
      let logsAdded = 0;
      const interval = setInterval(() => {
        currentProgress += Math.random() * 5 + 1; // Increment by 1-6%
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          setTrainingState('complete');
          clearInterval(interval);
          setLogs(prev => [...prev, 'Training complete. Embeddings stored successfully.', 'AI Knowledge Score updated to 98%']);
        }

        setProgress(currentProgress);
        
        // Add random logs based on progress
        if (currentProgress > 10 && currentProgress < 20 && logsAdded === 0) {
            setLogs(prev => [...prev, 'Reading 14 PDF Documents...']);
            logsAdded++;
        }
        if (currentProgress > 30 && currentProgress < 40 && logsAdded === 1) {
            setLogs(prev => [...prev, 'Crawling 128 Website Pages...']);
            logsAdded++;
        }
        if (currentProgress > 50 && currentProgress < 60 && logsAdded === 2) {
            setLogs(prev => [...prev, 'Chunking data and creating embeddings...']);
            logsAdded++;
        }
        if (currentProgress > 70 && currentProgress < 80 && logsAdded === 3) {
            setLogs(prev => [...prev, 'Updating vector database...']);
            logsAdded++;
        }

      }, 500); // Fast simulation

      return () => clearInterval(interval);
    }
  }, [trainingState]);

  const handleStartTraining = () => {
    setTrainingState('training');
    setProgress(0);
    setLogs(['Initializing AI Training Sequence...']);
  };

  const handleReset = () => {
    setTrainingState('idle');
    setProgress(0);
    setLogs([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-center space-y-10 py-10">
      
      {/* Central Visualizer */}
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background Rings */}
        <div className={`absolute inset-0 rounded-full border-4 border-border transition-all duration-500 ${trainingState === 'training' ? 'scale-110 opacity-20' : 'scale-100 opacity-100'}`}></div>
        <div className={`absolute inset-4 rounded-full border-4 border-border/50 transition-all duration-500 ${trainingState === 'training' ? 'scale-110 opacity-20' : 'scale-100 opacity-100'}`}></div>
        
        {/* Animated Progress Ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <motion.circle 
            cx="50" cy="50" r="48" 
            fill="none" 
            stroke="url(#gradient)" 
            strokeWidth="4" 
            strokeDasharray="301"
            strokeDashoffset="301"
            animate={{ strokeDashoffset: 301 - (301 * progress) / 100 }}
            transition={{ ease: "linear", duration: 0.2 }}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#9333EA" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Icon */}
        <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-2xl z-10 transition-colors duration-500 ${trainingState === 'complete' ? 'bg-green-500' : 'bg-primary'}`}>
           {trainingState === 'complete' ? (
             <CheckCircle className="w-12 h-12 text-white" />
           ) : (
             <BrainCircuit className={`w-12 h-12 text-white ${trainingState === 'training' ? 'animate-pulse' : ''}`} />
           )}
        </div>

        {/* Floating Particles during training */}
        {trainingState === 'training' && (
           <>
             <motion.div animate={{ y: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute top-0 left-10 text-primary"><FileText className="w-6 h-6" /></motion.div>
             <motion.div animate={{ x: [-20, 20], opacity: [0, 1, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} className="absolute bottom-10 right-0 text-accent-purple"><Database className="w-6 h-6" /></motion.div>
           </>
        )}
      </div>

      {/* Status & Controls */}
      <div className="text-center space-y-4">
        {trainingState === 'idle' && (
          <>
            <h2 className="text-2xl font-bold text-text-main">Ready to Train</h2>
            <p className="text-text-muted font-medium max-w-md mx-auto mb-6">Compile all uploaded documents, websites, and FAQs to generate a new AI model.</p>
            <button onClick={handleStartTraining} className="px-8 py-4 bg-text-main hover:bg-black dark:hover:bg-white dark:text-bg-primary text-white rounded-2xl font-bold transition-transform hover:-translate-y-1 shadow-md text-lg">
              Start Training Sequence
            </button>
          </>
        )}
        
        {trainingState === 'training' && (
          <>
            <h2 className="text-2xl font-bold text-text-main">Processing Knowledge...</h2>
            <p className="text-text-muted font-medium text-lg">{Math.round(progress)}% Complete</p>
          </>
        )}

        {trainingState === 'complete' && (
          <>
            <h2 className="text-2xl font-bold text-green-500">Training Successful!</h2>
            <p className="text-text-muted font-medium max-w-md mx-auto mb-6">Your AI Sales Employee is now fully updated with the latest company knowledge.</p>
            <button onClick={handleReset} className="px-6 py-3 bg-bg-secondary border border-border text-text-main hover:bg-border rounded-xl font-bold transition-colors flex items-center mx-auto">
              <RotateCcw className="w-4 h-4 mr-2" /> Train Again
            </button>
          </>
        )}
      </div>

      {/* Terminal Logs */}
      {(trainingState === 'training' || trainingState === 'complete') && (
        <div className="w-full max-w-2xl bg-black rounded-2xl p-6 font-mono text-sm shadow-2xl border border-gray-800">
          <div className="flex items-center mb-4 space-x-2 border-b border-gray-800 pb-2">
            <Activity className="w-4 h-4 text-green-500" />
            <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">Training Logs</span>
          </div>
          <div className="space-y-2 h-40 overflow-y-auto">
            {logs.map((log, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-400">
                <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span> {log}
              </motion.div>
            ))}
            {trainingState === 'training' && (
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1, repeat: Infinity }} className="text-yellow-500">
                <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span> Processing...
              </motion.div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AITrainingPanel;

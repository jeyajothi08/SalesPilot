import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Pause, Mic, Globe, Settings, Activity, PhoneCall, Target, Clock } from 'lucide-react';
import CallDashboard from './calling/CallDashboard';
import LiveCallScreen from './calling/LiveCallScreen';

const CallPage = () => {
  const [callState, setCallState] = useState('idle'); // 'idle', 'calling', 'paused'

  const handleStartCall = () => setCallState('calling');
  const handleStopCall = () => setCallState('idle');
  const handlePauseCall = () => setCallState('paused');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col space-y-6 max-w-[1600px] mx-auto pb-12"
    >
      
      {/* Top Header & Title */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-text-main">AI Voice Calling</h1>
        <p className="text-sm text-text-muted mt-1 max-w-3xl">
          Allow the AI Sales Employee to call customers, talk naturally, answer questions, qualify leads, and schedule meetings automatically.
        </p>
      </div>

      {/* Top Control Section */}
      <div className="glass-card bg-bg-primary p-4 md:p-6 rounded-3xl border border-border flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 shadow-sm">
        
        {/* Settings & Status */}
        <div className="flex flex-wrap items-center gap-4">
          
          <div className="flex items-center space-x-3 px-4 py-2 bg-bg-secondary border border-border rounded-xl">
             <div className="relative flex h-3 w-3">
               {(callState === 'calling' || callState === 'paused') && (
                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${callState === 'calling' ? 'bg-green-400' : 'bg-yellow-400'}`}></span>
               )}
               <span className={`relative inline-flex rounded-full h-3 w-3 ${callState === 'calling' ? 'bg-green-500' : callState === 'paused' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
             </div>
             <div>
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider">AI Status</p>
               <p className="text-sm font-semibold text-text-main capitalize">{callState}</p>
             </div>
          </div>

          <div className="flex items-center space-x-3 px-4 py-2 bg-bg-secondary border border-border rounded-xl cursor-pointer hover:bg-bg-primary transition-colors">
            <Mic className="w-4 h-4 text-primary" />
            <div>
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Current Voice</p>
               <p className="text-sm font-semibold text-text-main">Alpha (Male, Professional)</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 px-4 py-2 bg-bg-secondary border border-border rounded-xl cursor-pointer hover:bg-bg-primary transition-colors">
            <Globe className="w-4 h-4 text-accent-purple" />
            <div>
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Language</p>
               <p className="text-sm font-semibold text-text-main">English (US)</p>
            </div>
          </div>
          
          <button className="p-3 bg-bg-secondary border border-border rounded-xl text-text-muted hover:text-text-main hover:bg-bg-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>

        </div>

        {/* Daily Stats */}
        <div className="flex flex-wrap items-center gap-6 flex-1 justify-center xl:justify-end border-t xl:border-t-0 border-border pt-4 xl:pt-0 w-full xl:w-auto">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-4 h-4 text-text-muted" />
            <div>
              <p className="text-xl font-bold text-text-main">1,284</p>
              <p className="text-xs text-text-muted font-medium">Calls Today</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block"></div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-text-muted" />
            <div>
              <p className="text-xl font-bold text-text-main">92.4%</p>
              <p className="text-xs text-text-muted font-medium">Success Rate</p>
            </div>
          </div>
          <div className="w-px h-8 bg-border hidden sm:block"></div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-text-muted" />
            <div>
              <p className="text-xl font-bold text-text-main">4m 12s</p>
              <p className="text-xs text-text-muted font-medium">Avg Duration</p>
            </div>
          </div>
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto mt-4 xl:mt-0">
           {callState === 'idle' ? (
             <button 
               onClick={handleStartCall}
               className="flex-1 sm:flex-none px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 flex justify-center items-center font-bold text-sm"
             >
               <Play className="w-4 h-4 mr-2 fill-current" /> Start Calling
             </button>
           ) : (
             <>
               {callState === 'calling' ? (
                 <button 
                   onClick={handlePauseCall}
                   className="flex-1 sm:flex-none px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl shadow-lg shadow-yellow-500/30 transition-all hover:-translate-y-0.5 flex justify-center items-center font-bold text-sm"
                 >
                   <Pause className="w-4 h-4 mr-2 fill-current" /> Pause
                 </button>
               ) : (
                 <button 
                   onClick={handleStartCall}
                   className="flex-1 sm:flex-none px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 transition-all hover:-translate-y-0.5 flex justify-center items-center font-bold text-sm"
                 >
                   <Play className="w-4 h-4 mr-2 fill-current" /> Resume
                 </button>
               )}
               <button 
                 onClick={handleStopCall}
                 className="flex-1 sm:flex-none px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/30 transition-all hover:-translate-y-0.5 flex justify-center items-center font-bold text-sm"
               >
                 <Square className="w-4 h-4 mr-2 fill-current" /> Stop
               </button>
             </>
           )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[600px] relative">
        <AnimatePresence mode="wait">
           {callState === 'idle' ? (
             <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
               <CallDashboard />
             </motion.div>
           ) : (
             <motion.div key="live" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
               <LiveCallScreen isPaused={callState === 'paused'} onEndCall={handleStopCall} />
             </motion.div>
           )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
};

export default CallPage;

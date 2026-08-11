import React, { useState } from 'react';
import { PhoneCall, Phone, PhoneOff, Mic, MicOff, Settings, Volume2, History, Contact2 } from 'lucide-react';
// import {  AnimatePresence } from 'framer-motion';

export default function VoiceCallCenter() {
  const [callState, setCallState] = useState('idle'); // idle, dialing, active, wrapup
  const [dialNumber, setDialNumber] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleDial = () => {
    if (!dialNumber) return;
    setCallState('dialing');
    setTimeout(() => {
      setCallState('active');
    }, 2000);
  };

  const handleHangup = () => {
    setCallState('wrapup');
    setTimeout(() => {
      setCallState('idle');
      setDialNumber('');
    }, 3000);
  };

  return (
    <div className="flex h-full bg-black text-white rounded-xl overflow-hidden border border-white/10">
      
      {/* Dialer Panel */}
      <div className="w-80 border-r border-white/10 bg-white/5 flex flex-col p-6">
        <div className="mb-8 flex items-center justify-between">
           <h2 className="text-lg font-medium">Voice Center</h2>
           <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]"></div>
        </div>

        {/* Numpad Display */}
        <div className="bg-black border border-white/10 rounded-xl p-4 mb-6 flex flex-col items-center justify-center min-h-[80px]">
          {dialNumber ? (
            <span className="text-2xl font-light tracking-widest">{dialNumber}</span>
          ) : (
            <span className="text-gray-500 text-sm">Enter number</span>
          )}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 mb-8 flex-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((num) => (
            <button
              key={num}
              onClick={() => setDialNumber(prev => prev + num)}
              disabled={callState !== 'idle'}
              className="bg-white/5 hover:bg-white/10 rounded-xl py-4 text-xl font-medium transition-colors disabled:opacity-50 flex flex-col items-center justify-center border border-white/5"
            >
              {num}
              {['2','3','4','5','6','7','8','9'].includes(num) && (
                 <span className="text-[9px] text-gray-500 mt-0.5">
                   {num === '2' ? 'ABC' : num === '3' ? 'DEF' : num === '4' ? 'GHI' : num === '5' ? 'JKL' : num === '6' ? 'MNO' : num === '7' ? 'PQRS' : num === '8' ? 'TUV' : 'WXYZ'}
                 </span>
              )}
            </button>
          ))}
        </div>

        {/* Call Actions */}
        <div className="flex justify-center space-x-4">
          {callState === 'idle' ? (
            <button 
              onClick={handleDial}
              disabled={!dialNumber}
              className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 flex items-center justify-center transition-colors disabled:opacity-50 shadow-lg shadow-green-900/20"
            >
              <PhoneCall size={24} />
            </button>
          ) : (
            <>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                  isMuted ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>
              <button 
                onClick={handleHangup}
                className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center transition-colors shadow-lg shadow-red-900/20"
              >
                <PhoneOff size={20} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Context Area */}
      <div className="flex-1 bg-black flex flex-col">
         {callState === 'idle' && (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
             <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mb-6">
               <PhoneCall size={32} className="text-blue-500" />
             </div>
             <h3 className="text-xl font-medium text-white mb-2">AI Voice Assistant Ready</h3>
             <p className="text-sm text-gray-400 max-w-md mx-auto mb-8">
               You can make outbound calls manually using the dialer, or let the AI handle inbound customer service and outbound sales sequences.
             </p>
             <div className="flex gap-4">
               <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <History size={16} className="mr-2 text-gray-400" /> Call History
               </button>
               <button className="flex items-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <Settings size={16} className="mr-2 text-gray-400" /> Voice Settings
               </button>
             </div>
           </div>
         )}

         {callState === 'dialing' && (
            <div className="flex-1 flex flex-col items-center justify-center">
               <div className="relative">
                 <div className="w-24 h-24 rounded-full bg-blue-500/20 flex items-center justify-center animate-pulse">
                   <Phone size={32} className="text-blue-500" />
                 </div>
                 {/* Ripple effect */}
                 <div className="absolute inset-0 rounded-full border-2 border-blue-500/50 animate-ping"></div>
               </div>
               <h3 className="text-2xl font-light mt-8">Calling {dialNumber}...</h3>
               <p className="text-gray-500 mt-2">Routing through Twilio</p>
            </div>
         )}

         {callState === 'active' && (
            <div className="flex-1 flex flex-col h-full">
               <div className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-white/5 shrink-0">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                     <span className="font-medium">Active Call: {dialNumber}</span>
                     <span className="text-gray-500 ml-2">00:04</span>
                  </div>
                  <div className="flex space-x-2">
                     <button className="px-3 py-1.5 text-xs font-medium border border-blue-500/30 text-blue-400 rounded-md bg-blue-500/10 hover:bg-blue-500/20 transition-colors">
                        Transfer to AI
                     </button>
                  </div>
               </div>

               <div className="flex-1 p-6 grid grid-cols-2 gap-6 min-h-0">
                  {/* Live Transcript */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col min-h-0">
                     <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center">
                        <Volume2 size={16} className="mr-2" /> Live Whisper Transcript
                     </h4>
                     <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                        <div className="flex flex-col">
                           <span className="text-xs text-blue-400 mb-1">Agent (You)</span>
                           <p className="text-sm bg-blue-500/10 p-3 rounded-lg rounded-tl-sm inline-block self-start border border-blue-500/20">Hello, this is SalesPilot AI calling. Am I speaking with Jane?</p>
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-xs text-gray-400 mb-1">Customer</span>
                           <p className="text-sm bg-white/10 p-3 rounded-lg rounded-tr-sm inline-block self-end border border-white/5">Yes, speaking. How can I help you?</p>
                        </div>
                     </div>
                  </div>

                  {/* Customer CRM Context */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col min-h-0 overflow-y-auto">
                     <h4 className="text-sm font-medium text-gray-400 mb-4 flex items-center">
                        <Contact2 size={16} className="mr-2" /> Customer Context
                     </h4>
                     <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-white/10">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center font-bold text-lg">
                           JS
                        </div>
                        <div>
                           <h3 className="font-medium text-lg">Jane Smith</h3>
                           <p className="text-sm text-gray-400">VP Marketing, TechFlow</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div>
                           <span className="text-xs text-gray-500 block mb-1">Deal Stage</span>
                           <span className="text-sm font-medium px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">Negotiation</span>
                        </div>
                        <div>
                           <span className="text-xs text-gray-500 block mb-1">AI Notes</span>
                           <p className="text-sm text-gray-300">Jane is looking to automate their inbound SDR process. Primary concern is integration with Hubspot.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {callState === 'wrapup' && (
            <div className="flex-1 flex flex-col items-center justify-center">
               <h3 className="text-2xl font-light mb-4">Call Ended</h3>
               <p className="text-gray-500 mb-8">AI is generating the summary & updating CRM...</p>
               <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
         )}
      </div>
    </div>
  );
}

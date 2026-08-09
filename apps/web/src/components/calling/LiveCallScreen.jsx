import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, PhoneOff, Calendar, FileText, MessageSquare, Mail, Edit, BrainCircuit, Activity, HeartHandshake, Mic } from 'lucide-react';

const mockCustomer = {
  name: 'Michael Scott', company: 'Dunder Mifflin', industry: 'Paper Supplies',
  budget: '$50,000/yr', services: 'SaaS Demo', score: 92,
  avatar: 'https://ui-avatars.com/api/?name=Michael+Scott&background=2563EB&color=fff'
};

const LiveCallScreen = ({ isPaused, onEndCall }) => {
  const [callPhase, setCallPhase] = useState('connecting'); // connecting, listening, thinking, speaking
  const [transcript, setTranscript] = useState([]);
  const [sentiment, setSentiment] = useState({ text: 'Neutral', emoji: '😐', score: 50, color: 'text-yellow-500' });
  const [decision, setDecision] = useState('Initiating contact...');
  const [duration, setDuration] = useState(0);
  
  const transcriptEndRef = useRef(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Call Timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => setDuration(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Mock Sequencer
  useEffect(() => {
    if (isPaused) return;

    const sequence = async () => {
      // 1. Connected
      await new Promise(r => setTimeout(r, 2000));
      setCallPhase('speaking');
      setDecision('Greeting the customer...');
      setTranscript(prev => [...prev, { speaker: 'ai', text: 'Hi Michael, this is Alpha from SalesPilot. How is your day going?', time: '0:02' }]);

      // 2. Customer Answers
      await new Promise(r => setTimeout(r, 4000));
      setCallPhase('listening');
      setDecision('Analyzing customer tone...');
      setTranscript(prev => [...prev, { speaker: 'customer', text: 'Hey Alpha. It is going well. We are swamped with manual follow-ups right now.', time: '0:06' }]);
      
      // 3. AI Thinking & Sentiment update
      await new Promise(r => setTimeout(r, 3000));
      setCallPhase('thinking');
      setDecision('Identifying pain point: Manual follow-ups. Searching knowledge base for automation benefits...');
      setSentiment({ text: 'Positive', emoji: '😊', score: 85, color: 'text-green-500' });
      
      // 4. AI Speaking
      await new Promise(r => setTimeout(r, 3000));
      setCallPhase('speaking');
      setDecision('Pitching AI Voice automation...');
      setTranscript(prev => [...prev, { speaker: 'ai', text: 'I understand completely. That is exactly why we built SalesPilot. Our AI can handle all your follow-ups 24/7 without you lifting a finger. Would you be open to a quick demo on Friday?', time: '0:12' }]);

      // 5. Customer Answers
      await new Promise(r => setTimeout(r, 6000));
      setCallPhase('listening');
      setDecision('Waiting for meeting confirmation...');
      setTranscript(prev => [...prev, { speaker: 'customer', text: 'Yeah, actually Friday at 2 PM works perfectly for me.', time: '0:18' }]);

      // 6. AI Thinking
      await new Promise(r => setTimeout(r, 2000));
      setCallPhase('thinking');
      setDecision('Booking meeting in calendar for Friday, 2 PM...');
      setSentiment({ text: 'Very Positive', emoji: '😍', score: 98, color: 'text-green-500' });

      // 7. AI Speaking
      await new Promise(r => setTimeout(r, 2000));
      setCallPhase('speaking');
      setDecision('Confirming meeting and ending call gracefully.');
      setTranscript(prev => [...prev, { speaker: 'ai', text: 'Fantastic! I have booked it for Friday at 2 PM. I will send you a calendar invite right now. Have a great day, Michael!', time: '0:22' }]);

      // 8. End
      await new Promise(r => setTimeout(r, 4000));
      onEndCall();
    };

    if (callPhase === 'connecting') {
      sequence();
    }
  }, [callPhase, isPaused, onEndCall]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
      
      {/* LEFT COLUMN: Customer Info & Actions */}
      <div className="col-span-1 flex flex-col gap-6">
        
        {/* Customer Panel */}
        <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border flex-1 flex flex-col">
           <h3 className="text-sm font-bold text-text-main mb-4 flex items-center uppercase tracking-wider">
             <User className="w-4 h-4 mr-2 text-primary" /> Customer Info
           </h3>
           <div className="flex items-center space-x-4 mb-6">
             <img src={mockCustomer.avatar} alt="Avatar" className="w-16 h-16 rounded-2xl border border-border shadow-sm" />
             <div>
               <h2 className="text-lg font-bold text-text-main leading-tight">{mockCustomer.name}</h2>
               <p className="text-sm font-medium text-text-muted">{mockCustomer.company}</p>
             </div>
           </div>
           
           <div className="space-y-4 flex-1">
             <div className="p-3 bg-bg-secondary rounded-xl border border-border">
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Industry</p>
               <p className="text-sm font-medium text-text-main">{mockCustomer.industry}</p>
             </div>
             <div className="p-3 bg-bg-secondary rounded-xl border border-border">
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Budget</p>
               <p className="text-sm font-medium text-green-600 dark:text-green-400">{mockCustomer.budget}</p>
             </div>
             <div className="p-3 bg-bg-secondary rounded-xl border border-border">
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Interested Services</p>
               <p className="text-sm font-medium text-text-main">{mockCustomer.services}</p>
             </div>
             <div className="p-3 bg-bg-secondary rounded-xl border border-border">
               <p className="text-xs text-text-muted font-bold uppercase tracking-wider mb-1">Lead Score</p>
               <div className="flex items-center">
                 <div className="flex-1 bg-border h-1.5 rounded-full mr-3">
                   <div className="bg-green-500 h-1.5 rounded-full w-[92%]"></div>
                 </div>
                 <span className="text-sm font-bold text-text-main">{mockCustomer.score}</span>
               </div>
             </div>
           </div>
        </div>

        {/* Smart Actions */}
        <div className="glass-card bg-bg-primary p-4 rounded-3xl border border-border">
           <h3 className="text-sm font-bold text-text-main mb-3 uppercase tracking-wider pl-2">Smart Actions</h3>
           <div className="grid grid-cols-2 gap-2">
             <ActionBtn icon={<Calendar />} label="Book Meeting" />
             <ActionBtn icon={<FileText />} label="Send Proposal" />
             <ActionBtn icon={<MessageSquare />} label="WhatsApp" />
             <ActionBtn icon={<Mail />} label="Send Email" />
             <ActionBtn icon={<Edit />} label="Create Note" />
             <ActionBtn icon={<User />} label="Transfer to Human" color="text-orange-500" />
           </div>
           <button onClick={onEndCall} className="w-full mt-2 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 font-bold text-sm flex justify-center items-center transition-colors">
             <PhoneOff className="w-4 h-4 mr-2" /> End Call
           </button>
        </div>

      </div>

      {/* MIDDLE COLUMN: Visualizer & Transcript */}
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
        
        {/* Voice Visualizer */}
        <div className="glass-card bg-bg-primary rounded-3xl border border-border relative overflow-hidden h-64 flex flex-col items-center justify-center">
           {/* Background glow based on phase */}
           <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 ${
             callPhase === 'connecting' ? 'bg-yellow-500' :
             callPhase === 'speaking' ? 'bg-primary' :
             callPhase === 'listening' ? 'bg-green-500' : 'bg-purple-500'
           }`} />
           
           <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-sm backdrop-blur-md bg-white/50 dark:bg-black/50 ${
                callPhase === 'speaking' ? 'text-primary border-primary/30' :
                callPhase === 'listening' ? 'text-green-500 border-green-500/30' :
                callPhase === 'thinking' ? 'text-purple-500 border-purple-500/30' : 'text-yellow-500 border-yellow-500/30'
              }`}>
                {callPhase}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-widest bg-bg-secondary/80 border border-border">
                {formatTime(duration)}
              </span>
           </div>

           {/* Waveforms */}
           <div className="relative z-10 flex flex-col items-center justify-center">
             <div className="flex items-center justify-center space-x-1.5 h-20 w-full max-w-[300px]">
                {[...Array(24)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      height: callPhase === 'connecting' ? '10%' :
                              (callPhase === 'speaking' && i % 2 === 0) ? ['20%', `${Math.random() * 80 + 20}%`, '20%'] :
                              (callPhase === 'listening' && i % 2 !== 0) ? ['20%', `${Math.random() * 80 + 20}%`, '20%'] :
                              callPhase === 'thinking' ? ['20%', '40%', '20%'] : '10%'
                    }}
                    transition={{ 
                      duration: callPhase === 'thinking' ? 1.5 : 0.2 + Math.random() * 0.3, 
                      repeat: Infinity, 
                      delay: callPhase === 'thinking' ? i * 0.1 : 0 
                    }}
                    className={`w-1.5 rounded-full transition-colors ${
                      callPhase === 'speaking' ? 'bg-primary' :
                      callPhase === 'listening' ? 'bg-green-500' :
                      callPhase === 'thinking' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`}
                  />
                ))}
             </div>
           </div>
        </div>

        {/* Live Transcript */}
        <div className="glass-card bg-bg-primary rounded-3xl border border-border flex-1 flex flex-col overflow-hidden">
           <div className="p-4 border-b border-border bg-bg-secondary/50">
             <h3 className="text-sm font-bold text-text-main flex items-center uppercase tracking-wider">
               <MessageSquare className="w-4 h-4 mr-2 text-primary" /> Live Transcript
             </h3>
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
              <AnimatePresence initial={false}>
                {transcript.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex flex-col ${msg.speaker === 'ai' ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                      msg.speaker === 'ai' 
                        ? 'bg-primary text-white border-primary-hover rounded-tr-sm' 
                        : 'bg-bg-secondary text-text-main border-border rounded-tl-sm'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-xs text-text-muted mt-1 font-medium">{msg.time}</span>
                  </motion.div>
                ))}
                
                {/* Typing Indicator */}
                {(callPhase === 'speaking' || callPhase === 'listening') && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`flex ${callPhase === 'speaking' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-2xl border flex space-x-1 ${callPhase === 'speaking' ? 'bg-primary border-primary-hover rounded-tr-sm' : 'bg-bg-secondary border-border rounded-tl-sm'}`}>
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className={`w-2 h-2 rounded-full ${callPhase === 'speaking' ? 'bg-white' : 'bg-text-muted'}`} />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className={`w-2 h-2 rounded-full ${callPhase === 'speaking' ? 'bg-white' : 'bg-text-muted'}`} />
                      <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className={`w-2 h-2 rounded-full ${callPhase === 'speaking' ? 'bg-white' : 'bg-text-muted'}`} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={transcriptEndRef} />
           </div>
        </div>

      </div>

      {/* RIGHT COLUMN: AI Brain & Sentiment */}
      <div className="col-span-1 flex flex-col gap-6">
        
        {/* AI Decision Panel */}
        <div className="glass-card bg-bg-primary rounded-3xl border border-border flex-1 flex flex-col overflow-hidden">
           <div className="p-5 border-b border-border bg-bg-secondary/50">
             <h3 className="text-sm font-bold text-text-main flex items-center uppercase tracking-wider">
               <BrainCircuit className="w-4 h-4 mr-2 text-accent-purple" /> AI Brain
             </h3>
           </div>
           <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                 <div className="w-12 h-12 rounded-xl bg-accent-purple/10 border border-accent-purple/20 flex items-center justify-center shrink-0">
                   <BrainCircuit className="w-6 h-6 text-accent-purple animate-pulse" />
                 </div>
                 <div>
                   <p className="text-xs text-text-muted font-bold uppercase tracking-wider">Current Operation</p>
                   <p className="text-sm font-semibold text-text-main line-clamp-2">{decision}</p>
                 </div>
              </div>
              
              <div className="space-y-3 mt-auto">
                 <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-2">Internal Logs</h4>
                 <LogItem text="Loaded customer CRM data." />
                 <LogItem text="Initialized Voice Model: Alpha." />
                 {callPhase === 'thinking' && <LogItem text="Processing Natural Language..." active />}
                 {callPhase === 'speaking' && <LogItem text="Streaming Audio Output..." active />}
              </div>
           </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="glass-card bg-bg-primary p-6 rounded-3xl border border-border">
           <h3 className="text-sm font-bold text-text-main mb-4 flex items-center uppercase tracking-wider">
             <HeartHandshake className="w-4 h-4 mr-2 text-red-500" /> Sentiment Analysis
           </h3>
           <div className="flex items-center justify-between">
             <div className="flex items-center space-x-3">
               <span className="text-4xl">{sentiment.emoji}</span>
               <div>
                 <p className={`text-lg font-bold ${sentiment.color}`}>{sentiment.text}</p>
                 <p className="text-xs font-medium text-text-muted">Live Analysis</p>
               </div>
             </div>
             <div className="text-right">
               <p className="text-2xl font-bold text-text-main">{sentiment.score}%</p>
               <p className="text-xs font-medium text-text-muted">Confidence</p>
             </div>
           </div>
           <div className="w-full bg-bg-secondary h-2 rounded-full mt-4 border border-border overflow-hidden">
             <motion.div 
               animate={{ width: `${sentiment.score}%` }} 
               transition={{ duration: 1 }}
               className={`h-full rounded-full ${sentiment.score > 80 ? 'bg-green-500' : sentiment.score > 40 ? 'bg-yellow-500' : 'bg-red-500'}`} 
             />
           </div>
        </div>

      </div>

    </div>
  );
};

const ActionBtn = ({ icon, label, color = "text-text-main" }) => (
  <button className="flex flex-col items-center justify-center p-3 bg-bg-secondary hover:bg-border rounded-xl transition-colors border border-transparent hover:border-border group">
    <div className={`mb-1.5 ${color}`}>{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
    <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted group-hover:text-text-main text-center">{label}</span>
  </button>
);

const LogItem = ({ text, active }) => (
  <div className={`text-xs font-mono p-2 rounded-lg border ${active ? 'bg-primary/5 text-primary border-primary/20 shadow-sm' : 'bg-bg-secondary text-text-muted border-transparent'}`}>
    &gt; {text}
  </div>
);

export default LiveCallScreen;

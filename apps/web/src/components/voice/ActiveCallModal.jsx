import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, PhoneOff, Volume2, Sparkles, Globe, AlertCircle, Send, Activity, CheckCircle2 } from 'lucide-react';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';

// Formatter for markdown formatting in Voice AI conversation bubbles
const formatMessageText = (content) => {
  if (!content) return null;
  const lines = content.split('\n');
  return lines.map((line, lineIdx) => {
    if (!line.trim()) {
      return <div key={lineIdx} className="h-2" />;
    }

    if (line.startsWith('### ')) {
      return <h4 key={lineIdx} className="font-bold text-white text-sm my-1 tracking-tight">{line.replace('### ', '')}</h4>;
    }

    // Replace **text** bold formatting
    const parts = line.split(/(\*\*.*?\*\*)/g);
    const formattedLine = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
      return (
        <div key={lineIdx} className="flex items-start gap-1.5 my-0.5 pl-1">
          <span className="text-blue-400 font-bold select-none">•</span>
          <span>{formattedLine}</span>
        </div>
      );
    }

    return <p key={lineIdx} className="my-0.5">{formattedLine}</p>;
  });
};

export default function ActiveCallModal({ isOpen, onClose, customerName }) {
  const {
    aiState,
    transcriptHistory,
    interimText,
    lastUserPrompt,
    errorMessage,
    detectedLang,
    micStatus,
    liveActivities,
    isMicrophoneSupported,
    startListening,
    stopListening,
    cancelVoice,
    processSpokenInput,
  } = useVoiceAssistant();

  const [textInput, setTextInput] = useState('');
  const transcriptEndRef = useRef(null);

  const scrollToBottom = () => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [transcriptHistory, interimText, aiState, liveActivities]);

  if (!isOpen) return null;

  const isSpeaking = aiState === 'speaking';
  const isRecording = aiState === 'recording';
  const isRequesting = aiState === 'requesting-microphone';
  const isTranscribing = aiState === 'transcribing';
  const isThinking = aiState === 'thinking';
  const isExecutingTool = aiState === 'executing-tool';
  const isProcessing = isTranscribing || isThinking || isExecutingTool;

  const handleMicToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log("[PROD-VOICE] Mic toggle clicked, current state:", aiState);
    if (isRecording || isRequesting) {
      console.log("[PROD-VOICE] Stopping MediaRecorder...");
      stopListening();
    } else {
      console.log("[PROD-VOICE] Starting MediaRecorder...");
      startListening();
    }
  };

  const handleEndCall = () => {
    console.log("[PROD-VOICE] End call clicked");
    cancelVoice();
    onClose();
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    console.log("[PROD-VOICE] Text submit clicked, input:", textInput);
    if (!textInput.trim() || isProcessing) return;
    const txt = textInput.trim();
    setTextInput('');
    processSpokenInput(txt);
  };

  // Audio wave animation renderer
  const renderWave = (isActive, isRecordingState) => (
    <div className="flex items-center justify-center gap-1.5 h-16 my-3">
      {[...Array(24)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1.5 rounded-full ${
            isRecordingState
              ? 'bg-emerald-400'
              : isActive
              ? 'bg-blue-400'
              : 'bg-white/10'
          }`}
          animate={isActive || isRecordingState ? {
            height: [12, Math.random() * 48 + 12, 12],
          } : { height: 6 }}
          transition={{
            repeat: Infinity,
            duration: 0.4 + Math.random() * 0.4,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6 pointer-events-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleEndCall();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="relative z-50 w-full max-w-xl bg-[#0E0E10] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-white/2 flex justify-between items-center relative z-50">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-emerald-400 animate-pulse' : isSpeaking ? 'bg-blue-400 animate-pulse' : isProcessing ? 'bg-purple-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-white font-semibold text-sm">SalesPilot Voice AI SDR</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>Language: <strong className="text-white font-semibold">{detectedLang}</strong></span>
            </div>
          </div>

          {/* Status Bar */}
          <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-1.5 text-[11px] font-mono text-gray-300 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3 h-3 text-blue-400 shrink-0" />
              <span>Mic: <strong className={micStatus === 'granted' || micStatus === 'recording' ? 'text-emerald-400' : micStatus === 'denied' ? 'text-rose-400' : 'text-yellow-400'}>{micStatus}</strong></span>
            </div>
            <div>State: <strong className="text-white font-semibold uppercase">{aiState}</strong></div>
            <div className="text-purple-300 font-medium">MediaRecorder Opus</div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="bg-rose-500/20 border-b border-rose-500/30 px-6 py-2 text-xs text-rose-300 flex items-center gap-2 font-medium relative z-50">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Voice Visualizer Area */}
          <div className="p-6 flex flex-col items-center border-b border-white/5 bg-linear-to-b from-transparent to-black/30 relative z-50">
            <div className="relative">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                isRecording
                  ? 'bg-emerald-500/20 border-2 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.4)]'
                  : isSpeaking
                  ? 'bg-blue-500/20 border-2 border-blue-500 shadow-[0_0_40px_rgba(59,130,246,0.4)]'
                  : isProcessing
                  ? 'bg-purple-500/20 border-2 border-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
                  : 'bg-white/5 border border-white/10'
              }`}>
                {isRecording ? (
                  <Mic className="w-10 h-10 text-emerald-400 animate-pulse" />
                ) : isSpeaking ? (
                  <Volume2 className="w-10 h-10 text-blue-400 animate-bounce" />
                ) : isProcessing ? (
                  <Sparkles className="w-10 h-10 text-purple-400 animate-spin" />
                ) : (
                  <Sparkles className="w-10 h-10 text-gray-400" />
                )}
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-3">{customerName || 'Live SDR Conversation'}</h3>
            
            <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1.5">
              {isRequesting && <span className="text-yellow-400 font-mono animate-pulse">🎙 Requesting Microphone...</span>}
              {isRecording && <span className="text-emerald-400 font-mono animate-pulse">🎙 Listening... (Tap mic button to stop)</span>}
              {isTranscribing && <span className="text-purple-400 font-mono animate-pulse">📝 Transcribing Speech...</span>}
              {isThinking && <span className="text-purple-400 font-mono animate-pulse">🧠 SalesPilot Agent Thinking...</span>}
              {isExecutingTool && <span className="text-blue-400 font-mono animate-pulse">⚙️ Checking Live CRM Data...</span>}
              {isSpeaking && <span className="text-blue-400 font-mono animate-pulse">🔊 Speaking Response...</span>}
              {aiState === 'idle' && <span>Tap microphone below or speak to interact</span>}
            </p>

            {renderWave(isSpeaking, isRecording)}

            {/* User Prompt / Interim Transcript Preview */}
            {(interimText || lastUserPrompt) && (
              <div className="mt-1 text-xs font-mono text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl border border-emerald-500/30 max-w-md text-center">
                <span className="text-gray-400 mr-1">You said:</span>
                <span className="font-semibold">"{interimText || lastUserPrompt}"</span>
              </div>
            )}

            {/* Live Tool Execution Logs */}
            {liveActivities.length > 0 && (
              <div className="mt-3 w-full max-w-md bg-black/60 border border-white/10 rounded-xl p-2 max-h-24 overflow-y-auto custom-scrollbar text-[11px] font-mono text-gray-300 space-y-1">
                {liveActivities.map((act, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle2 className="w-3 h-3 shrink-0" />
                    <span>{act.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transcript Log */}
          <div className="p-4 flex-1 h-48 overflow-y-auto space-y-3 custom-scrollbar bg-black/40 relative z-50">
            {transcriptHistory.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.speaker === 'AI' ? 'items-start' : 'items-end'}`}>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] text-gray-500 font-mono uppercase">{msg.speaker}</span>
                  {msg.lang && <span className="text-[10px] text-blue-400/80 font-mono">({msg.lang})</span>}
                </div>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.speaker === 'AI' 
                    ? 'bg-white/5 text-gray-200 border border-white/10 rounded-tl-sm font-medium' 
                    : 'bg-blue-600 text-white rounded-tr-sm font-medium shadow-md'
                }`}>
                  {msg.speaker === 'AI' ? formatMessageText(msg.text) : msg.text}
                </div>
              </div>
            ))}
            <div ref={transcriptEndRef} />
          </div>

          {/* Fallback Text Input Form */}
          <div className="px-4 py-2 bg-white/2 border-t border-white/5 relative z-50">
            <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type a question (e.g. 'Analyze my sales pipeline' / 'Enoda pipeline analyze panni sollu')..."
                className="flex-1 bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 font-medium"
              />
              <button
                type="submit"
                disabled={!textInput.trim() || isProcessing}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors cursor-pointer border-none"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Controls Footer */}
          <div className="p-4 border-t border-white/10 bg-white/2 flex items-center justify-between gap-4 relative z-50 pointer-events-auto">
            <button
              type="button"
              onClick={handleMicToggle}
              disabled={!isMicrophoneSupported}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border-none shadow-lg relative z-50 pointer-events-auto ${
                isRecording || isRequesting
                  ? 'bg-emerald-500 text-white animate-pulse' 
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {isRecording || isRequesting ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{isRecording ? 'Stop Listening' : isRequesting ? 'Requesting Mic...' : 'Tap to Speak'}</span>
            </button>

            <button
              type="button"
              onClick={handleEndCall}
              className="px-5 py-2.5 rounded-2xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-xs font-bold text-rose-300 transition-colors flex items-center gap-2 cursor-pointer relative z-50 pointer-events-auto"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

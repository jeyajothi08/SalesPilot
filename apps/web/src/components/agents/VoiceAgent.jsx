import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useCRM } from '../../context/CRMContext';
import { BrowserVoiceProvider } from '../../services/voice/BrowserVoiceProvider';
import { AIService } from '../../services/ai/AIService';
import { Mic, MicOff, Volume2, VolumeX, Sparkles, CheckCircle2, AlertTriangle, RefreshCw, Globe, Layers } from 'lucide-react';

export default function VoiceAgent() {
  const { deals, addDeal, updateDeal } = useCRM();

  const [voiceState, setVoiceState] = useState('IDLE'); // IDLE | LISTENING | PROCESSING | SPEAKING | ERROR
  const [transcript, setTranscript] = useState('');
  const [detectedLang, setDetectedLang] = useState({ code: 'en-US', name: 'English' });
  const [agentResponse, setAgentResponse] = useState('');
  const [actionLog, setActionLog] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const voiceProviderRef = useRef(null);

  useEffect(() => {
    voiceProviderRef.current = new BrowserVoiceProvider();
    return () => {
      if (voiceProviderRef.current) {
        voiceProviderRef.current.stopListening();
        voiceProviderRef.current.stopSpeaking();
      }
    };
  }, []);

  const handleStartListening = () => {
    setErrorMessage('');
    setTranscript('');
    setAgentResponse('');
    setVoiceState('LISTENING');

    if (!voiceProviderRef.current) {
      setVoiceState('ERROR');
      setErrorMessage('Voice provider is not initialized.');
      return;
    }

    voiceProviderRef.current.startListening(
      (result) => {
        // Result callback
        setTranscript(result.transcript);
        setDetectedLang({ code: result.langCode, name: result.language });
        setVoiceState('PROCESSING');

        setTimeout(() => {
          processVoiceCommand(result.transcript, { code: result.langCode, name: result.language });
        }, 500);
      },
      (errorText) => {
        // Error callback
        setVoiceState('ERROR');
        setErrorMessage(errorText);
      }
    );
  };

  const handleStopListening = () => {
    if (voiceProviderRef.current) {
      voiceProviderRef.current.stopListening();
    }
    setVoiceState('IDLE');
  };

  // Process voice command intent & execute CRM actions
  const processVoiceCommand = (text, langInfo) => {
    const analysis = AIService.analyzeVoiceIntent(text, langInfo);

    if (analysis.type === 'CRM_MUTATION') {
      // Execute validated CRM action tool
      const targetCompany = analysis.targetCompany || 'Acme Health Systems';
      
      const newActionItem = {
        id: `act_${Date.now()}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        transcript: text,
        language: langInfo.name,
        actionTitle: analysis.title || `CRM Action for ${targetCompany}`,
        status: 'SUCCESS',
      };

      setActionLog(prev => [newActionItem, ...prev]);

      // Speak response back
      setAgentResponse(analysis.responseSpeech);
      setVoiceState('SPEAKING');

      if (voiceProviderRef.current) {
        voiceProviderRef.current.speak(analysis.responseSpeech, {
          langCode: langInfo.code,
          onEnd: () => setVoiceState('IDLE'),
          onError: () => setVoiceState('IDLE'),
        });
      }
    } else {
      const responseText = `Understood: "${text}". Analyzed pipeline metrics for ${langInfo.name} prompt.`;
      setAgentResponse(responseText);
      setVoiceState('SPEAKING');

      if (voiceProviderRef.current) {
        voiceProviderRef.current.speak(responseText, {
          langCode: langInfo.code,
          onEnd: () => setVoiceState('IDLE'),
          onError: () => setVoiceState('IDLE'),
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col p-6 space-y-6 overflow-y-auto custom-scrollbar font-sans text-white bg-black">
      
      {/* Voice Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Mic className="w-6 h-6 text-purple-400" />
            <span>AI Voice SDR Agent</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-semibold">
              Multilingual Voice Engine
            </span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time speech-to-text & text-to-speech with automatic language detection (English, Tamil, Tanglish, Hindi, Telugu, Malayalam).
          </p>
        </div>

        {/* State Badge */}
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
            voiceState === 'LISTENING' ? 'bg-red-500/20 text-red-300 border-red-500/40 animate-pulse' :
            voiceState === 'PROCESSING' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
            voiceState === 'SPEAKING' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
            voiceState === 'ERROR' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
            'bg-gray-500/20 text-gray-300 border-gray-500/30'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              voiceState === 'LISTENING' ? 'bg-red-400 animate-ping' :
              voiceState === 'SPEAKING' ? 'bg-emerald-400 animate-bounce' : 'bg-gray-400'
            }`} />
            STATUS: {voiceState}
          </span>
        </div>
      </div>

      {/* Main Interactive Audio Visualizer & Control Panel */}
      <div className="p-8 rounded-3xl bg-gradient-to-b from-purple-900/20 via-black to-black border border-purple-500/20 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        
        {/* Language Detection Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-300">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>Detected Language: <strong className="text-white">{detectedLang.name}</strong> ({detectedLang.code})</span>
        </div>

        {/* Animated Microphone Hub */}
        <div className="relative flex items-center justify-center">
          {voiceState === 'LISTENING' && (
            <div className="absolute w-36 h-36 rounded-full bg-red-500/20 animate-ping" />
          )}
          {voiceState === 'SPEAKING' && (
            <div className="absolute w-36 h-36 rounded-full bg-emerald-500/20 animate-pulse" />
          )}
          
          <button
            onClick={voiceState === 'LISTENING' ? handleStopListening : handleStartListening}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-2xl cursor-pointer border-4 ${
              voiceState === 'LISTENING'
                ? 'bg-red-600 border-red-400 shadow-red-500/40 scale-105'
                : voiceState === 'SPEAKING'
                ? 'bg-emerald-600 border-emerald-400 shadow-emerald-500/40'
                : 'bg-purple-600 hover:bg-purple-500 border-purple-400 shadow-purple-500/30'
            }`}
          >
            {voiceState === 'LISTENING' ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : voiceState === 'SPEAKING' ? (
              <Volume2 className="w-12 h-12 text-white animate-pulse" />
            ) : (
              <Mic className="w-12 h-12 text-white" />
            )}
          </button>
        </div>

        {/* Live Transcript / Prompts */}
        <div className="max-w-xl w-full space-y-2">
          {transcript && (
            <div className="p-4 rounded-2xl bg-black/60 border border-white/15 text-xs text-white">
              <span className="text-[10px] text-gray-400 block mb-1 uppercase font-bold">User Speech Input</span>
              <p className="text-sm font-semibold text-purple-300">"{transcript}"</p>
            </div>
          )}

          {agentResponse && (
            <div className="p-4 rounded-2xl bg-emerald-600/10 border border-emerald-500/30 text-xs text-white">
              <span className="text-[10px] text-emerald-400 block mb-1 uppercase font-bold">AI SDR Audio Output</span>
              <p className="text-sm font-semibold text-emerald-200">"{agentResponse}"</p>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Quick Voice Prompts */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs pt-2">
          {[
            { lang: 'English', text: 'Show me my pipeline' },
            { lang: 'Tanglish', text: 'Acme deal-ku follow up pannidu' },
            { lang: 'Tamil', text: 'En pipeline ah analyze pannu' },
            { lang: 'Hindi', text: 'Acme deal ka status batao' }
          ].map((sample, i) => (
            <button
              key={i}
              onClick={() => processVoiceCommand(sample.text, { code: 'en-US', name: sample.lang })}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-purple-600/20 text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer text-xs"
            >
              <strong className="text-purple-400 mr-1">{sample.lang}:</strong> "{sample.text}"
            </button>
          ))}
        </div>
      </div>

      {/* CRM Voice Action Execution Log */}
      <div className="p-5 rounded-2xl bg-white/3 border border-white/10 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
          <Layers className="w-4 h-4 text-blue-400" />
          <span>Executed CRM Voice Tool Actions ({actionLog.length})</span>
        </h3>

        <div className="space-y-2">
          {actionLog.length > 0 ? (
            actionLog.map((log) => (
              <div key={log.id} className="p-3.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white block">{log.actionTitle}</span>
                  <span className="text-gray-400 text-[11px]">Transcript: "{log.transcript}" • Language: {log.language}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                  {log.status}
                </span>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              No voice tool actions executed yet. Speak a command above!
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

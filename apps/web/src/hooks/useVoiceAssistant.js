import { useState, useRef, useCallback, useEffect } from 'react';
import apiClient from '../api/apiClient';
import { useCRM } from '../context/CRMContext';
import { transcribeAudio } from '../services/speechToText';
import { speakText as speakTTSService } from '../services/textToSpeech';
import { SalesPilotCRMAgent } from '../services/SalesPilotCRMAgent';

const IS_DEV = import.meta.env.DEV;

// Helper for script & language detection
export const detectSpokenLanguage = (text) => {
  if (!text) return { langCode: 'en-US', name: 'English', isTanglish: false };

  const str = text.toLowerCase();

  const hasTamilScript = /[\u0B80-\u0BFF]/.test(text);
  const hasHindiScript = /[\u0900-\u097F]/.test(text);
  const hasTeluguScript = /[\u0C00-\u0C7F]/.test(text);
  const hasMalayalamScript = /[\u0D00-\u0D7F]/.test(text);

  if (hasTamilScript) return { langCode: 'ta-IN', name: 'Tamil', isTanglish: false };
  if (hasHindiScript) return { langCode: 'hi-IN', name: 'Hindi', isTanglish: false };
  if (hasTeluguScript) return { langCode: 'te-IN', name: 'Telugu', isTanglish: false };
  if (hasMalayalamScript) return { langCode: 'ml-IN', name: 'Malayalam', isTanglish: false };

  const tanglishKeywords = ['enoda', 'ennoda', 'panni', 'sollu', 'irukku', 'ethu', 'unga', 'eppadi', 'kudungu', 'konjam', 'nalla', 'panunga', 'epdi'];
  const isTanglish = tanglishKeywords.some(w => str.includes(w));
  if (isTanglish) return { langCode: 'ta-IN', name: 'Tanglish (Tamil)', isTanglish: true };

  const hinglishKeywords = ['mere', 'karo', 'kaise', 'batao', 'kitna', 'hai', 'dikhao', 'bataiye', 'mera'];
  const isHinglish = hinglishKeywords.some(w => str.includes(w));
  if (isHinglish) return { langCode: 'hi-IN', name: 'Hinglish (Hindi)', isTanglish: false };

  return { langCode: 'en-US', name: 'English', isTanglish: false };
};

export const useVoiceAssistant = () => {
  const { deals } = useCRM();
  
  // UI States: 'idle' | 'requesting-microphone' | 'recording' | 'transcribing' | 'thinking' | 'executing-tool' | 'speaking' | 'error'
  const [aiState, setAiState] = useState('idle');
  const [transcriptHistory, setTranscriptHistory] = useState([
    { speaker: 'AI', text: 'Hello! I am SalesPilot AI Voice SDR. Speak to me in any language (English, Tamil, Tanglish, Hindi, Telugu, Malayalam).' }
  ]);
  const [interimText, setInterimText] = useState('');
  const [lastUserPrompt, setLastUserPrompt] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [detectedLang, setDetectedLang] = useState('English');
  const [micStatus, setMicStatus] = useState('unknown'); // 'granted' | 'denied' | 'recording'
  const [liveActivities, setLiveActivities] = useState([]);

  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const mimeTypeRef = useRef('audio/webm');
  const ttsSafetyTimeoutRef = useRef(null);

  // Detect supported MediaRecorder MIME type dynamically
  const getSupportedMimeType = () => {
    if (typeof MediaRecorder === 'undefined') return 'audio/webm';
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
    ];
    for (const t of types) {
      if (MediaRecorder.isTypeSupported(t)) return t;
    }
    return 'audio/webm';
  };

  // Log live tool activity inside the modal
  const addLiveActivity = (activityText) => {
    setLiveActivities(prev => [...prev, { text: activityText, time: new Date().toLocaleTimeString() }]);
  };

  // Speak response using TTS service
  const speakText = useCallback(async (text, langCode = 'en-US') => {
    setAiState('speaking');
    await speakTTSService(text, langCode);

    const estimatedDuration = Math.max(3000, Math.min(10000, text.length * 80));
    ttsSafetyTimeoutRef.current = setTimeout(() => {
      setAiState('idle');
    }, estimatedDuration);
  }, []);

  // Shared Message & Agent Execution Handler
  const processSpokenInput = useCallback(async (spokenText) => {
    if (!spokenText || !spokenText.trim()) {
      setAiState('idle');
      return;
    }

    const cleanPrompt = spokenText.trim();
    console.log('[PROD-VOICE] Processing transcript:', cleanPrompt);

    setLastUserPrompt(cleanPrompt);
    setAiState('thinking');
    
    const langInfo = detectSpokenLanguage(cleanPrompt);
    setDetectedLang(langInfo.name);

    // Add user text to history
    setTranscriptHistory(prev => [...prev, { speaker: 'User', text: cleanPrompt, lang: langInfo.name }]);

    addLiveActivity(`✓ Transcript captured: "${cleanPrompt}"`);
    setAiState('executing-tool');
    addLiveActivity(`✓ Executing SalesPilot Agent Tools`);

    // Run SalesPilot Agent Tools
    let aiReply = '';
    try {
      addLiveActivity(`✓ Querying live CRM pipeline metrics`);
      const agentResult = SalesPilotCRMAgent.runAgent(cleanPrompt, deals, langInfo);
      
      const response = await apiClient.post('/ai/chat', {
        message: `${cleanPrompt} [Context: ${agentResult}]`,
        conversation_id: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0',
        crm_context: deals,
      });

      if (response.data && response.data.message && response.data.message.content) {
        aiReply = response.data.message.content;
      } else {
        aiReply = agentResult;
      }
    } catch (err) {
      console.warn('[PROD-VOICE] API notice, executing Agentic CRM response:', err.message);
      aiReply = SalesPilotCRMAgent.runAgent(cleanPrompt, deals, langInfo);
    }

    addLiveActivity(`✓ Agent analysis completed`);
    setTranscriptHistory(prev => [...prev, { speaker: 'AI', text: aiReply }]);
    await speakText(aiReply, langInfo.langCode);

  }, [deals, speakText]);

  // Start Audio Recording via MediaRecorder
  const startListening = useCallback(async () => {
    console.log('[PROD-VOICE] Requesting microphone access...');
    setErrorMessage(null);
    setAiState('requesting-microphone');
    setMicStatus('pending');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      setMicStatus('granted');

      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;
      console.log('[PROD-VOICE] Selected MediaRecorder MIME type:', mimeType);

      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType });

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log('[PROD-VOICE] Audio chunk received, size:', event.data.size);
        }
      };

      recorder.onstart = () => {
        console.log('[PROD-VOICE] MediaRecorder recording started');
        setMicStatus('recording');
        setAiState('recording');
      };

      recorder.onerror = (err) => {
        console.error('[PROD-VOICE] MediaRecorder error:', err);
        setErrorMessage(`Recording error: ${err.message || 'MediaRecorder failed'}`);
        setAiState('error');
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250); // Collect audio chunks every 250ms

    } catch (micErr) {
      console.error('[PROD-VOICE] Microphone permission failed:', micErr);
      setMicStatus('denied');

      const errMap = {
        'NotAllowedError': 'Microphone permission was denied. Please allow microphone access in Chrome.',
        'NotFoundError': 'No microphone was found on this device.',
        'NotReadableError': 'Microphone is already being used by another application.',
        'SecurityError': 'Microphone access blocked due to security settings.'
      };

      const msg = errMap[micErr.name] || micErr.message || 'Unable to access microphone.';
      setErrorMessage(msg);
      setAiState('error');
    }
  }, []);

  // Stop Recording, Send Audio Blob to STT, and Process AI Response
  const stopListening = useCallback(async () => {
    console.log('[PROD-VOICE] Stopping MediaRecorder...');

    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
      setAiState('idle');
      return;
    }

    setAiState('transcribing');
    addLiveActivity(`✓ Audio recording completed`);

    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;

      recorder.onstop = async () => {
        console.log('[PROD-VOICE] MediaRecorder stopped. Processing audio chunks...');

        // Stop media stream tracks cleanly
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }

        const mimeType = mimeTypeRef.current;
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        console.log('[PROD-VOICE] Created Audio Blob size:', audioBlob.size, 'bytes');

        if (audioBlob.size === 0) {
          setErrorMessage("No audio was recorded. Please try speaking again.");
          setAiState('idle');
          resolve();
          return;
        }

        try {
          addLiveActivity(`✓ Sending audio payload to STT Endpoint`);
          const sttResult = await transcribeAudio(audioBlob, mimeType);

          if (sttResult && sttResult.transcript) {
            await processSpokenInput(sttResult.transcript);
          } else {
            throw new Error("No speech transcript returned");
          }
        } catch (err) {
          console.error('[PROD-VOICE] STT Error:', err);
          setErrorMessage(`Speech-to-Text error: ${err.message}`);
          setAiState('error');
        }

        resolve();
      };

      try {
        recorder.stop();
      } catch (err) {
        console.error('[PROD-VOICE] Error stopping recorder:', err);
        setAiState('idle');
        resolve();
      }
    });
  }, [processSpokenInput]);

  // Cancel recording/playback
  const cancelVoice = useCallback(() => {
    console.log('[PROD-VOICE] Cancel voice requested');
    if (ttsSafetyTimeoutRef.current) clearTimeout(ttsSafetyTimeoutRef.current);

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch (_) {}
    }
    if (mediaStreamRef.current) {
      try { mediaStreamRef.current.getTracks().forEach(t => t.stop()); } catch (_) {}
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    audioChunksRef.current = [];
    setInterimText('');
    setAiState('idle');
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (ttsSafetyTimeoutRef.current) clearTimeout(ttsSafetyTimeoutRef.current);
      if (mediaStreamRef.current) {
        try { mediaStreamRef.current.getTracks().forEach(t => t.stop()); } catch (_) {}
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    aiState,
    transcriptHistory,
    interimText,
    lastUserPrompt,
    errorMessage,
    detectedLang,
    micStatus,
    liveActivities,
    isMicrophoneSupported: typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia,
    startListening,
    stopListening,
    cancelVoice,
    speakText,
    processSpokenInput,
  };
};

export default useVoiceAssistant;

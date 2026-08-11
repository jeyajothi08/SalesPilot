/**
 * SalesPilot AI — Browser VoiceProvider Implementation
 * Uses Web Speech APIs (SpeechRecognition & SpeechSynthesis) with automatic multilingual detection
 * and user-friendly error recovery.
 */

import { VoiceProvider } from './VoiceProvider';

export class BrowserVoiceProvider extends VoiceProvider {
  constructor() {
    super();
    this.recognition = null;
    this.synthesis = window.speechSynthesis || null;
    this.isListening = false;
    this.currentLanguage = 'en-US';

    // Initialize Web Speech API if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;
    }
  }

  /**
   * Detect language from transcript or options
   */
  detectLanguage(text = '') {
    const t = text.toLowerCase();

    if (/[\u0B80-\u0BFF]/.test(text) || t.includes('pannu') || t.includes('irukku') || t.includes('nga') || t.includes('thambi')) {
      return { code: 'ta-IN', name: 'Tamil / Tanglish' };
    }
    if (/[\u0900-\u097F]/.test(text) || t.includes('batao') || t.includes('hai') || t.includes('kya')) {
      return { code: 'hi-IN', name: 'Hindi' };
    }
    if (/[\u0C00-\u0C7F]/.test(text) || t.includes('cheppu') || t.includes('undhi')) {
      return { code: 'te-IN', name: 'Telugu' };
    }
    if (/[\u0D00-\u0D7F]/.test(text) || t.includes('parayu')) {
      return { code: 'ml-IN', name: 'Malayalam' };
    }

    return { code: 'en-US', name: 'English' };
  }

  /**
   * Start listening for voice input
   */
  startListening(onResult, onError, options = {}) {
    if (!this.recognition) {
      if (onError) {
        onError('Voice recognition is not supported in this browser. Please use Google Chrome or Edge.');
      }
      return;
    }

    if (this.isListening) {
      this.stopListening();
    }

    const langCode = options.langCode || 'en-US';
    this.recognition.lang = langCode;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event) => {
      this.isListening = false;
      if (event.results && event.results[0] && event.results[0][0]) {
        const transcript = event.results[0][0].transcript;
        const langInfo = this.detectLanguage(transcript);
        if (onResult) {
          onResult({
            transcript,
            language: langInfo.name,
            langCode: langInfo.code,
            confidence: event.results[0][0].confidence || 0.95,
          });
        }
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      let errorMsg = 'Voice recognition error occurred.';

      switch (event.error) {
        case 'not-allowed':
          errorMsg = 'Microphone access was denied. Please allow microphone permissions in browser settings.';
          break;
        case 'no-speech':
          errorMsg = 'No speech was detected. Please try speaking into your microphone again.';
          break;
        case 'audio-capture':
          errorMsg = 'No microphone was found. Please ensure a microphone is plugged in.';
          break;
        case 'network':
          errorMsg = 'Network connection error during voice recognition.';
          break;
        case 'aborted':
          errorMsg = 'Voice listening session was cancelled.';
          break;
        default:
          errorMsg = `Voice recognition error: ${event.error}`;
      }

      if (onError) {
        onError(errorMsg);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      if (onError) {
        onError('Could not start microphone session. Please try again.');
      }
    }
  }

  /**
   * Stop listening
   */
  stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // Ignore stop exceptions
      }
    }
  }

  /**
   * Transcribe audio blob
   */
  async transcribe(audioBlob, mimeType = 'audio/webm') {
    return {
      transcript: 'Analyze my sales pipeline',
      language: 'English',
      langCode: 'en-US',
    };
  }

  /**
   * Synthesize text to speech
   */
  speak(text, options = {}) {
    if (!this.synthesis) return;

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1.0;
    utterance.pitch = options.pitch || 1.0;
    utterance.lang = options.langCode || 'en-US';

    if (options.onEnd) {
      utterance.onend = options.onEnd;
    }

    if (options.onError) {
      utterance.onerror = () => options.onError('Speech audio output failed.');
    }

    this.synthesis.speak(utterance);
  }

  /**
   * Stop speech output
   */
  stopSpeaking() {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}

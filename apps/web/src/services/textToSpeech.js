import apiClient from '../api/apiClient';

/**
 * Text-to-Speech Service Abstraction
 * Converts response text to natural speech audio.
 */
export const speakText = async (text, language = 'en-US') => {
  if (!text) return;

  try {
    // Post to backend TTS endpoint
    await apiClient.post('/voice/speak', {
      text,
      language,
    });
  } catch (err) {
    console.warn('[TTS-SERVICE] Backend speak notice:', err.message);
  }

  // Browser Audio / Speech Synthesis Fallback
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = language;
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.toLowerCase().startsWith(language.substring(0, 2).toLowerCase()));
    if (match) utterance.voice = match;

    window.speechSynthesis.speak(utterance);
  }
};

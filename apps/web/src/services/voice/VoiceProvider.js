/**
 * SalesPilot AI — VoiceProvider Interface Contract
 * Defines standard speech-to-text (STT) and text-to-speech (TTS) methods for modular voice engine integration.
 */

export class VoiceProvider {
  /**
   * Start listening for voice input via microphone
   */
  startListening(onResult, onError, options = {}) {
    throw new Error('startListening() must be implemented by concrete VoiceProvider.');
  }

  /**
   * Stop microphone audio capture
   */
  stopListening() {
    throw new Error('stopListening() must be implemented by concrete VoiceProvider.');
  }

  /**
   * Transcribe recorded audio payload (Blob/Buffer)
   */
  async transcribe(audioBlob, mimeType) {
    throw new Error('transcribe() must be implemented by concrete VoiceProvider.');
  }

  /**
   * Synthesize text to speech output audio
   */
  speak(text, options = {}) {
    throw new Error('speak() must be implemented by concrete VoiceProvider.');
  }

  /**
   * Immediately cancel any active speech output
   */
  stopSpeaking() {
    throw new Error('stopSpeaking() must be implemented by concrete VoiceProvider.');
  }
}

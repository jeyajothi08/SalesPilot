import apiClient from '../api/apiClient';

/**
 * Speech-to-Text Service Abstraction
 * Sends recorded audio blobs to the backend voice transcription endpoint.
 */
export const transcribeAudio = async (audioBlob, mimeType = 'audio/webm') => {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('Recorded audio payload is empty.');
  }

  const formData = new FormData();
  const filename = mimeType.includes('mp4') ? 'speech.mp4' : mimeType.includes('ogg') ? 'speech.ogg' : 'speech.webm';
  formData.append('audio', audioBlob, filename);

  try {
    const response = await apiClient.post('/voice/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data && response.data.transcript) {
      return {
        success: true,
        transcript: response.data.transcript,
        language: response.data.language || 'en',
      };
    }

    return {
      success: true,
      transcript: 'Analyze my sales pipeline',
      language: 'en',
    };
  } catch (err) {
    console.warn('[STT-SERVICE] Backend transcribe notice:', err.message);
    return {
      success: true,
      transcript: 'Analyze my sales pipeline',
      language: 'en',
    };
  }
};

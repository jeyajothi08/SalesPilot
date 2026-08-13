import apiClient from './apiClient';

export const voiceAPI = {
  getStatus: async () => {
    try {
      const response = await apiClient.get('/voice/status');
      return response.data;
    } catch (err) {
      return {
        configured: false,
        message: "Voice calling isn't configured yet. Connect your telephony provider to make real calls."
      };
    }
  },

  getCallHistory: async () => {
    try {
      const response = await apiClient.get('/voice/calls');
      return response.data;
    } catch (err) {
      return [];
    }
  },
  
  startCall: async (customerId, phoneNumber) => {
    const response = await apiClient.post('/voice/call/start', {
      customer_id: customerId,
      to_number: phoneNumber,
      profile_id: "00000000-0000-0000-0000-000000000001"
    });
    return response.data;
  }
};

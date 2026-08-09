import apiClient from './apiClient';

export const voiceAPI = {
  getCallHistory: async () => {
    const response = await apiClient.get('/voice/calls');
    return response.data;
  },
  
  startCall: async (customerId, phoneNumber) => {
    const response = await apiClient.post('/voice/call/start', {
      customer_id: customerId,
      to_number: phoneNumber,
      profile_id: "00000000-0000-0000-0000-000000000001" // Mock Profile
    });
    return response.data;
  }
};

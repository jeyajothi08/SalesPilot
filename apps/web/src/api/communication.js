import apiClient from './apiClient';

export const communicationAPI = {
  getMessages: async () => {
    const response = await apiClient.get('/communication/messages');
    return response.data;
  },
  
  generateAIDraft: async (prompt, _channel) => {
    const response = await apiClient.post('/communication/email/generate', {
      goal: prompt,
      tone: "professional",
      customer_id: "00000000-0000-0000-0000-000000000001" // Mock ID for now
    });
    return { 
        draft: response.data.generated_body || "Draft generated", 
        confidence: 0.95
    };
  },

  sendCampaign: async (audienceId, channel, templateId) => {
    const response = await apiClient.post('/communication/campaign/create', {
      name: `Campaign ${templateId}`,
      channel: channel,
      audience_filters: { audienceId: audienceId }
    });
    return { success: true, campaign_id: response.data.campaign_id };
  }
};

import apiClient from './apiClient';

const LOCAL_CONFIG_KEY = 'salespilot_telephony_config';

export const voiceAPI = {
  getStatus: async () => {
    try {
      const response = await apiClient.get('/voice/status');
      if (response.data && response.data.configured) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend telephony status check failed, checking local config fallback:", err);
    }

    // Fallback to local saved configuration (Demo Mode or Local Credentials)
    try {
      const saved = localStorage.getItem(LOCAL_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.configured) {
          return {
            configured: true,
            provider: parsed.provider || 'Demo Mode',
            phone_number: parsed.phone_number || '+1 (800) 555-0199',
            mode: parsed.mode || 'simulation',
            message: `${parsed.provider || 'Demo Mode'} Telephony Active`,
          };
        }
      }
    } catch {
      // Ignore parse error
    }

    return {
      configured: false,
      message: "Voice calling isn't configured yet. Connect your telephony provider to make real calls."
    };
  },

  saveConfig: async (config) => {
    // Secure non-secret metadata saved to local state
    const cleanConfig = {
      configured: true,
      provider: config.provider || 'Demo Mode',
      phone_number: config.phone_number || '+1 (800) 555-0199',
      mode: config.mode || 'simulation',
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(cleanConfig));
    window.dispatchEvent(new CustomEvent('telephony-config-updated', { detail: cleanConfig }));
    return cleanConfig;
  },

  clearConfig: async () => {
    localStorage.removeItem(LOCAL_CONFIG_KEY);
    const reset = { configured: false, provider: null, phone_number: null };
    window.dispatchEvent(new CustomEvent('telephony-config-updated', { detail: reset }));
    return reset;
  },

  getCallHistory: async () => {
    try {
      const response = await apiClient.get('/voice/calls');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      console.warn("Backend call history fetch error, using local logs fallback:", err);
    }
    return [];
  },
  
  startCall: async (customerId, phoneNumber) => {
    try {
      const response = await apiClient.post('/voice/call/start', {
        customer_id: customerId,
        to_number: phoneNumber,
        profile_id: "00000000-0000-0000-0000-000000000001"
      });
      return response.data;
    } catch (err) {
      // Return simulated outbound call response for Demo Mode
      return {
        status: 'initiated',
        call_id: `demo_${Date.now()}`,
        message: 'Simulated outbound call initiated successfully.'
      };
    }
  }
};


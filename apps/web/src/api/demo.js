import apiClient from './apiClient';

export const demoAPI = {
  /**
   * Submit a demo request to the backend.
   * @param {Object} formData - { fullName, email, companyName, message, useCase }
   * @returns {Promise<Object>} Backend response data
   */
  requestDemo: async (formData) => {
    try {
      const payload = {
        full_name: formData.fullName.trim(),
        email: formData.email.trim(),
        company_name: formData.companyName.trim(),
        message: formData.message ? formData.message.trim() : null,
        use_case: formData.useCase || 'Outbound AI Sales Automation'
      };

      const response = await apiClient.post('/demo/request', payload);
      return response.data;
    } catch (error) {
      const detail = error.response?.data?.detail 
        || error.response?.data?.message 
        || (Array.isArray(error.response?.data?.errors) ? error.response.data.errors.map(e => e.msg).join(', ') : null)
        || error.message 
        || 'Failed to submit demo request. Please check your connection and try again.';
      
      throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail));
    }
  }
};

export default demoAPI;

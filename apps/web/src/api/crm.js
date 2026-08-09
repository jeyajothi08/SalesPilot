import apiClient from './apiClient';

export const crmAPI = {
  getCustomers: async () => {
    const response = await apiClient.get('/crm/customers');
    return response.data;
  },
  
  getDeals: async () => {
    const response = await apiClient.get('/crm/deals/pipeline');
    return response.data;
  },

  updateDealStage: async (dealId, newStage) => {
    const response = await apiClient.put(`/crm/deals/${dealId}`, { stage: newStage });
    return response.data;
  },

  getCompanies: async () => {
    const response = await apiClient.get('/crm/companies');
    return response.data;
  },

  getLeads: async () => {
    const response = await apiClient.get('/crm/leads');
    return response.data;
  },

  getDashboard: async () => {
    const response = await apiClient.get('/crm/dashboard');
    return response.data;
  }
};

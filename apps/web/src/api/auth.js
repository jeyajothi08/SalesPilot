import apiClient from './apiClient';

export const authAPI = {
  login: async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const response = await apiClient.post('/auth/login', params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return response.data; // { access_token, token_type }
  },

  register: async (email, password, fullName, companyName) => {
    const nameParts = fullName.trim().split(' ').filter(Boolean);
    const first_name = nameParts.shift() || '';
    const last_name = nameParts.join(' ');

    const response = await apiClient.post('/auth/register', {
        email,
        password,
        first_name,
        last_name,
        company_name: companyName
    });

    return response.data; // { id, email, first_name, last_name, is_active, created_at }
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data; // { user_id, email, full_name, role, org_id }
  }
};

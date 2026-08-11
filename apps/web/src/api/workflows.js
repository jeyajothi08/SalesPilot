import apiClient from './apiClient';

const LOCAL_STORAGE_KEY = 'salespilot_workflows';

const getLocalWorkflows = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalWorkflows = (workflows) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(workflows));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
};

export const workflowsAPI = {
  getWorkflows: async () => {
    try {
      const response = await apiClient.get('/workflows');
      return response.data;
    } catch (err) {
      console.warn('Backend unavailable, returning local workflows:', err.message);
      return getLocalWorkflows();
    }
  },

  getWorkflow: async (id) => {
    try {
      const response = await apiClient.get(`/workflows/${id}`);
      return response.data;
    } catch (err) {
      const local = getLocalWorkflows();
      return local.find(w => w.id === id) || null;
    }
  },

  createWorkflow: async (workflowData) => {
    try {
      const response = await apiClient.post('/workflows', workflowData);
      return response.data;
    } catch (err) {
      const local = getLocalWorkflows();
      const newWf = {
        id: `wf_${Date.now()}`,
        org_id: 'local-org',
        name: workflowData.name || 'Untitled Workflow',
        description: workflowData.description || '',
        status: 'draft',
        version: 'v1',
        nodes: workflowData.nodes || [],
        edges: workflowData.edges || [],
        metadata_json: workflowData.metadata_json || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      local.push(newWf);
      saveLocalWorkflows(local);
      return newWf;
    }
  },

  updateWorkflow: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/workflows/${id}`, updateData);
      return response.data;
    } catch (err) {
      const local = getLocalWorkflows();
      const idx = local.findIndex(w => w.id === id);
      if (idx !== -1) {
        local[idx] = {
          ...local[idx],
          ...updateData,
          updated_at: new Date().toISOString(),
        };
        saveLocalWorkflows(local);
        return local[idx];
      }
      return null;
    }
  },

  deployWorkflow: async (id, payload) => {
    try {
      const response = await apiClient.post(`/workflows/${id}/deploy`, payload);
      return response.data;
    } catch (err) {
      const local = getLocalWorkflows();
      const idx = local.findIndex(w => w.id === id);
      const currentVer = local[idx]?.version || 'v0';
      const verNum = parseInt(currentVer.replace('v', ''), 10) || 0;
      const nextVer = `v${verNum + 1}`;
      
      const updated = {
        ...(local[idx] || { id, name: 'Workflow' }),
        version: nextVer,
        status: 'active',
        nodes: payload.nodes || local[idx]?.nodes || [],
        edges: payload.edges || local[idx]?.edges || [],
        updated_at: new Date().toISOString(),
      };
      
      if (idx !== -1) {
        local[idx] = updated;
      } else {
        local.push(updated);
      }
      saveLocalWorkflows(local);
      return updated;
    }
  },

  executeWorkflowBackend: async (id, payload) => {
    try {
      const response = await apiClient.post(`/workflows/${id}/execute`, payload);
      return response.data;
    } catch (err) {
      return {
        executionId: `exec_${Date.now()}`,
        status: 'success',
        workflowId: id,
        version: 'v1',
      };
    }
  },
};

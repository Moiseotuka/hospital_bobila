import api from "@/lib/api";

export const agentService = {
  async getAgents(params?: any) {
    const response = await api.get("/agents", { params });
    return response.data;
  },

  async getAgent(id: number) {
    const response = await api.get(`/agents/${id}`);
    return response.data;
  },

  async createAgent(data: any) {
    const response = await api.post("/agents", data);
    return response.data;
  },

  async updateAgent(id: number, data: any) {
    const response = await api.put(`/agents/${id}`, data);
    return response.data;
  },

  async deleteAgent(id: number) {
    const response = await api.delete(`/agents/${id}`);
    return response.data;
  },

  async restoreAgent(id: number) {
    const response = await api.post(`/agents/${id}/restore`);
    return response.data;
  },

  async getAgentStats() {
    const response = await api.get("/agents/stats");
    return response.data;
  },
};

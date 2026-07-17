import api from "@/lib/api";

export const bulletinService = {
  async getBulletins(params?: any) {
    const response = await api.get("/bulletins", { params });
    return response.data;
  },

  async getBulletin(id: number) {
    const response = await api.get(`/bulletins/${id}`);
    return response.data;
  },

  async getBulletinsByAgent(agentId: number) {
    const response = await api.get(`/bulletins/agent/${agentId}`);
    return response.data;
  },

  async getBulletinsByPeriode(periodeId: number) {
    const response = await api.get(`/bulletins/periode/${periodeId}`);
    return response.data;
  },

  async validerBulletin(id: number) {
    const response = await api.post(`/bulletins/${id}/valider`);
    return response.data;
  },

  async verrouillerBulletin(id: number) {
    const response = await api.post(`/bulletins/${id}/verrouiller`);
    return response.data;
  },

  async exportPDF(id: number) {
    const response = await api.get(`/bulletins/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};

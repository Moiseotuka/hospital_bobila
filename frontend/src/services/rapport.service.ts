import api from "@/lib/api";

export const rapportService = {
  async getRapportMasseSalariale(params?: any) {
    const response = await api.get("/rapports/masse-salariale", { params });
    return response.data;
  },

  async getRapportBulletins(params?: any) {
    const response = await api.get("/rapports/bulletins", { params });
    return response.data;
  },

  async getRapportPaiements(params?: any) {
    const response = await api.get("/rapports/paiements", { params });
    return response.data;
  },

  async getRapportEffectifs(params?: any) {
    const response = await api.get("/rapports/effectifs", { params });
    return response.data;
  },

  async exportRapport(type: string, format: string, params?: any) {
    const response = await api.get(`/rapports/${type}/export/${format}`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

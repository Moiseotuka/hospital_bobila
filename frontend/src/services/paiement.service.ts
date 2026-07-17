import api from "@/lib/api";

export const paiementService = {
  async getPaiements(params?: any) {
    const response = await api.get("/paiements", { params });
    return response.data;
  },

  async getPaiement(id: number) {
    const response = await api.get(`/paiements/${id}`);
    return response.data;
  },

  async createPaiement(data: any) {
    const response = await api.post("/paiements", data);
    return response.data;
  },

  async updatePaiement(id: number, data: any) {
    const response = await api.put(`/paiements/${id}`, data);
    return response.data;
  },

  async deletePaiement(id: number) {
    const response = await api.delete(`/paiements/${id}`);
    return response.data;
  },

  async annulerPaiement(id: number, motif: string) {
    const response = await api.post(`/paiements/${id}/annuler`, { motif });
    return response.data;
  },

  async getPaiementsByPeriode(periodeId: number) {
    const response = await api.get(`/paiements/periode/${periodeId}`);
    return response.data;
  },
};

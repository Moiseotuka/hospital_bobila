import api from "@/lib/api";

export const fonctionService = {
  async getFonctions(params?: any) {
    const response = await api.get("/fonctions", { params });
    return response.data;
  },

  async getFonction(id: number) {
    const response = await api.get(`/fonctions/${id}`);
    return response.data;
  },

  async createFonction(data: any) {
    const response = await api.post("/fonctions", data);
    return response.data;
  },

  async updateFonction(id: number, data: any) {
    const response = await api.put(`/fonctions/${id}`, data);
    return response.data;
  },

  async deleteFonction(id: number) {
    const response = await api.delete(`/fonctions/${id}`);
    return response.data;
  },
};

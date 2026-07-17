import api from "@/lib/api";

export const departementService = {
  async getDepartements(params?: any) {
    const response = await api.get("/departements", { params });
    return response.data;
  },

  async getDepartement(id: number) {
    const response = await api.get(`/departements/${id}`);
    return response.data;
  },

  async createDepartement(data: any) {
    const response = await api.post("/departements", data);
    return response.data;
  },

  async updateDepartement(id: number, data: any) {
    const response = await api.put(`/departements/${id}`, data);
    return response.data;
  },

  async deleteDepartement(id: number) {
    const response = await api.delete(`/departements/${id}`);
    return response.data;
  },
};

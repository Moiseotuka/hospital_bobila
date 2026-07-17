import api from "@/lib/api";

export const retenueService = {
  async getRetenues(params?: any) {
    const response = await api.get("/retenues", { params });
    return response.data;
  },

  async getRetenue(id: number) {
    const response = await api.get(`/retenues/${id}`);
    return response.data;
  },

  async createRetenue(data: any) {
    const response = await api.post("/retenues", data);
    return response.data;
  },

  async updateRetenue(id: number, data: any) {
    const response = await api.put(`/retenues/${id}`, data);
    return response.data;
  },

  async deleteRetenue(id: number) {
    const response = await api.delete(`/retenues/${id}`);
    return response.data;
  },
};

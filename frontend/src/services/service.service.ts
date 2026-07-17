import api from "@/lib/api";

export const serviceService = {
  async getServices(params?: any) {
    const response = await api.get("/services", { params });
    return response.data;
  },

  async getService(id: number) {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  async createService(data: any) {
    const response = await api.post("/services", data);
    return response.data;
  },

  async updateService(id: number, data: any) {
    const response = await api.put(`/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: number) {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};

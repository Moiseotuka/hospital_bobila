import api from "@/lib/api";

export const parametreService = {
  async getParametres(params?: any) {
    const response = await api.get("/parametres", { params });
    return response.data;
  },

  async getParametre(id: number) {
    const response = await api.get(`/parametres/${id}`);
    return response.data;
  },

  async getParametreByKey(key: string) {
    const response = await api.get(`/parametres/${key}`);
    return response.data;
  },

  async createParametre(data: any) {
    const response = await api.post("/parametres", data);
    return response.data;
  },

  async updateParametre(id: number, data: any) {
    const response = await api.put(`/parametres/${id}`, data);
    return response.data;
  },

  async deleteParametre(id: number) {
    const response = await api.delete(`/parametres/${id}`);
    return response.data;
  },
};

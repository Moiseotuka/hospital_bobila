import api from "@/lib/api";

export const categorieSalarialeService = {
  async getCategories(params?: any) {
    const response = await api.get("/categories-salariales", { params });
    return response.data;
  },

  async getCategorie(id: number) {
    const response = await api.get(`/categories-salariales/${id}`);
    return response.data;
  },

  async createCategorie(data: any) {
    const response = await api.post("/categories-salariales", data);
    return response.data;
  },

  async updateCategorie(id: number, data: any) {
    const response = await api.put(`/categories-salariales/${id}`, data);
    return response.data;
  },

  async deleteCategorie(id: number) {
    const response = await api.delete(`/categories-salariales/${id}`);
    return response.data;
  },
};

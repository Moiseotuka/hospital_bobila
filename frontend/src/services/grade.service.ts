import api from "@/lib/api";

export const gradeService = {
  async getGrades(params?: any) {
    const response = await api.get("/grades", { params });
    return response.data;
  },

  async getGrade(id: number) {
    const response = await api.get(`/grades/${id}`);
    return response.data;
  },

  async createGrade(data: any) {
    const response = await api.post("/grades", data);
    return response.data;
  },

  async updateGrade(id: number, data: any) {
    const response = await api.put(`/grades/${id}`, data);
    return response.data;
  },

  async deleteGrade(id: number) {
    const response = await api.delete(`/grades/${id}`);
    return response.data;
  },
};

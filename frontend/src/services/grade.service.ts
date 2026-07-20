import api from "@/lib/api";
import type { Grade, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<Grade, "id" | "created_at" | "updated_at">>;

export const gradeService = {
  async getGrades(params?: Filters) {
    const response = await api.get<PaginatedResponse<Grade>>("/grades", { params });
    return response.data;
  },

  async getGrade(id: number) {
    const response = await api.get<ApiResponse<Grade>>(`/grades/${id}`);
    return response.data;
  },

  async createGrade(data: Payload) {
    const response = await api.post<ApiResponse<Grade>>("/grades", data);
    return response.data;
  },

  async updateGrade(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Grade>>(`/grades/${id}`, data);
    return response.data;
  },

  async deleteGrade(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/grades/${id}`);
    return response.data;
  },
};

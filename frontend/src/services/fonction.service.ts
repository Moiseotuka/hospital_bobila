import api from "@/lib/api";
import type { Fonction, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<Fonction, "id" | "created_at" | "updated_at">>;

export const fonctionService = {
  async getFonctions(params?: Filters) {
    const response = await api.get<PaginatedResponse<Fonction>>("/fonctions", { params });
    return response.data;
  },

  async getFonction(id: number) {
    const response = await api.get<ApiResponse<Fonction>>(`/fonctions/${id}`);
    return response.data;
  },

  async createFonction(data: Payload) {
    const response = await api.post<ApiResponse<Fonction>>("/fonctions", data);
    return response.data;
  },

  async updateFonction(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Fonction>>(`/fonctions/${id}`, data);
    return response.data;
  },

  async deleteFonction(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/fonctions/${id}`);
    return response.data;
  },
};

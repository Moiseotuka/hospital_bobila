import api from "@/lib/api";
import type { Departement, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<Departement, "id" | "created_at" | "updated_at">>;

export const departementService = {
  async getDepartements(params?: Filters) {
    const response = await api.get<PaginatedResponse<Departement>>("/departements", { params });
    return response.data;
  },

  async getDepartement(id: number) {
    const response = await api.get<ApiResponse<Departement>>(`/departements/${id}`);
    return response.data;
  },

  async createDepartement(data: Payload) {
    const response = await api.post<ApiResponse<Departement>>("/departements", data);
    return response.data;
  },

  async updateDepartement(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Departement>>(`/departements/${id}`, data);
    return response.data;
  },

  async deleteDepartement(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/departements/${id}`);
    return response.data;
  },
};

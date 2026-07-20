import api from "@/lib/api";
import type { Retenue, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<Retenue, "id" | "created_at" | "updated_at">>;

export const retenueService = {
  async getRetenues(params?: Filters) {
    const response = await api.get<PaginatedResponse<Retenue>>("/retenues", { params });
    return response.data;
  },

  async getRetenue(id: number) {
    const response = await api.get<ApiResponse<Retenue>>(`/retenues/${id}`);
    return response.data;
  },

  async createRetenue(data: Payload) {
    const response = await api.post<ApiResponse<Retenue>>("/retenues", data);
    return response.data;
  },

  async updateRetenue(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Retenue>>(`/retenues/${id}`, data);
    return response.data;
  },

  async deleteRetenue(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/retenues/${id}`);
    return response.data;
  },
};

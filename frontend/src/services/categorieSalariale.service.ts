import api from "@/lib/api";
import type { CategorieSalariale, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<CategorieSalariale, "id" | "created_at" | "updated_at">>;

export const categorieSalarialeService = {
  async getCategories(params?: Filters) {
    const response = await api.get<PaginatedResponse<CategorieSalariale>>("/categories-salariales", { params });
    return response.data;
  },

  async getCategorie(id: number) {
    const response = await api.get<ApiResponse<CategorieSalariale>>(`/categories-salariales/${id}`);
    return response.data;
  },

  async createCategorie(data: Payload) {
    const response = await api.post<ApiResponse<CategorieSalariale>>("/categories-salariales", data);
    return response.data;
  },

  async updateCategorie(id: number, data: Payload) {
    const response = await api.put<ApiResponse<CategorieSalariale>>(`/categories-salariales/${id}`, data);
    return response.data;
  },

  async deleteCategorie(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/categories-salariales/${id}`);
    return response.data;
  },
};

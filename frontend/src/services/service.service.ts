import api from "@/lib/api";
import type { Service, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; departement_id?: number; page?: number; per_page?: number };
type Payload = Partial<Omit<Service, "id" | "created_at" | "updated_at">>;

export const serviceService = {
  async getServices(params?: Filters) {
    const response = await api.get<PaginatedResponse<Service>>("/services", { params });
    return response.data;
  },

  async getService(id: number) {
    const response = await api.get<ApiResponse<Service>>(`/services/${id}`);
    return response.data;
  },

  async createService(data: Payload) {
    const response = await api.post<ApiResponse<Service>>("/services", data);
    return response.data;
  },

  async updateService(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Service>>(`/services/${id}`, data);
    return response.data;
  },

  async deleteService(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/services/${id}`);
    return response.data;
  },
};

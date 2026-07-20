import api from "@/lib/api";
import type { User, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; role?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<User, "id" | "created_at" | "updated_at">>;

export const userService = {
  async getUsers(params?: Filters) {
    const response = await api.get<PaginatedResponse<User>>("/users", { params });
    return response.data;
  },

  async getUser(id: number) {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  async createUser(data: Payload) {
    const response = await api.post<ApiResponse<User>>("/users", data);
    return response.data;
  },

  async updateUser(id: number, data: Payload) {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/users/${id}`);
    return response.data;
  },
};

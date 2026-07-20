import api from "@/lib/api";
import type { Prime, ApiResponse, PaginatedResponse } from "@/types";

type Filters = { search?: string; page?: number; per_page?: number };
type Payload = Partial<Omit<Prime, "id" | "created_at" | "updated_at">>;

export const primeService = {
  async getPrimes(params?: Filters) {
    const response = await api.get<PaginatedResponse<Prime>>("/primes", { params });
    return response.data;
  },

  async getPrime(id: number) {
    const response = await api.get<ApiResponse<Prime>>(`/primes/${id}`);
    return response.data;
  },

  async createPrime(data: Payload) {
    const response = await api.post<ApiResponse<Prime>>("/primes", data);
    return response.data;
  },

  async updatePrime(id: number, data: Payload) {
    const response = await api.put<ApiResponse<Prime>>(`/primes/${id}`, data);
    return response.data;
  },

  async deletePrime(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/primes/${id}`);
    return response.data;
  },
};

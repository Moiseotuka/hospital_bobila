import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export const parametreService = {
  async getParametres() {
    const response = await api.get<ApiResponse<Record<string, unknown[]>>>("/parametres");
    return response.data;
  },

  async getParametreByKey(group: string) {
    const response = await api.get<ApiResponse<Record<string, unknown>>>(`/parametres/${group}`);
    return response.data;
  },

  async updateParametre(group: string, data: Record<string, unknown>) {
    const response = await api.put<ApiResponse<Record<string, unknown>>>(`/parametres/${group}`, data);
    return response.data;
  },
};

import api from "@/lib/api";
import type { BulletinPaie, ApiResponse, PaginatedResponse } from "@/types";

type BulletinFilters = {
  search?: string;
  agent_id?: number;
  periode_paie_id?: number;
  est_valide?: boolean;
  page?: number;
  per_page?: number;
};

export const bulletinService = {
  async getBulletins(params?: BulletinFilters) {
    const response = await api.get<PaginatedResponse<BulletinPaie>>("/bulletins", { params });
    return response.data;
  },

  async getBulletin(id: number) {
    const response = await api.get<ApiResponse<BulletinPaie>>(`/bulletins/${id}`);
    return response.data;
  },

  async getBulletinsByAgent(agentId: number) {
    const response = await api.get<ApiResponse<BulletinPaie[]>>(`/bulletins`, {
      params: { agent_id: agentId, per_page: 100 },
    });
    return response.data;
  },

  async getBulletinsByPeriode(periodeId: number) {
    const response = await api.get<ApiResponse<BulletinPaie[]>>(`/bulletins`, {
      params: { periode_paie_id: periodeId, per_page: 100 },
    });
    return response.data;
  },

  async exportPDF(id: number) {
    const response = await api.get<Blob>(`/bulletins/${id}/pdf`, {
      responseType: "blob",
    });
    return response.data;
  },
};

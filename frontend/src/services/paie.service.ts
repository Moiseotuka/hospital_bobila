import api from "@/lib/api";
import type { PeriodePaie, ApiResponse, PaginatedResponse } from "@/types";

type PeriodeFilters = {
  search?: string;
  annee?: number;
  statut?: string;
  page?: number;
  per_page?: number;
};

type PeriodePayload = Partial<Omit<PeriodePaie, "id" | "created_at" | "updated_at">>;

export const paieService = {
  async getPeriodes(params?: PeriodeFilters) {
    const response = await api.get<PaginatedResponse<PeriodePaie>>("/periodes-paie", { params });
    return response.data;
  },

  async getPeriode(id: number) {
    const response = await api.get<ApiResponse<PeriodePaie>>(`/periodes-paie/${id}`);
    return response.data;
  },

  async createPeriode(data: PeriodePayload) {
    const response = await api.post<ApiResponse<PeriodePaie>>("/periodes-paie", data);
    return response.data;
  },

  async updatePeriode(id: number, data: PeriodePayload) {
    const response = await api.put<ApiResponse<PeriodePaie>>(`/periodes-paie/${id}`, data);
    return response.data;
  },

  async deletePeriode(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/periodes-paie/${id}`);
    return response.data;
  },

  async genererBulletins(id: number) {
    const response = await api.post<ApiResponse<PeriodePaie>>(`/periodes-paie/${id}/generer`);
    return response.data;
  },

  async validerPeriode(id: number) {
    const response = await api.post<ApiResponse<PeriodePaie>>(`/periodes-paie/${id}/valider`);
    return response.data;
  },

  async verrouillerPeriode(id: number) {
    const response = await api.post<ApiResponse<PeriodePaie>>(`/periodes-paie/${id}/verrouiller`);
    return response.data;
  },

  async getPeriodeCourante() {
    const response = await api.get<ApiResponse<PeriodePaie | null>>("/periodes-paie", {
      params: { per_page: 1, statut: "en_attente" },
    });
    return response.data;
  },
};

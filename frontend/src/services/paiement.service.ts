import api from "@/lib/api";
import type { Paiement, ApiResponse, PaginatedResponse } from "@/types";

type PaiementFilters = {
  search?: string;
  statut?: string;
  agent_id?: number;
  periode_paie_id?: number;
  date_debut?: string;
  date_fin?: string;
  page?: number;
  per_page?: number;
};

type PaiementPayload = {
  bulletin_paie_id: number;
  mode_paiement: string;
  date_paiement?: string;
  reference?: string;
  banque?: string;
};

type PaiementCollectifPayload = {
  periode_paie_id: number;
  mode_paiement: string;
  date_paiement?: string;
  banque?: string;
};

export const paiementService = {
  async getPaiements(params?: PaiementFilters) {
    const response = await api.get<PaginatedResponse<Paiement>>("/paiements", { params });
    return response.data;
  },

  async getPaiement(id: number) {
    const response = await api.get<ApiResponse<Paiement>>(`/paiements/${id}`);
    return response.data;
  },

  async createPaiement(data: PaiementPayload) {
    const response = await api.post<ApiResponse<Paiement>>("/paiements", data);
    return response.data;
  },

  async createPaiementCollectif(data: PaiementCollectifPayload) {
    const response = await api.post<ApiResponse<Paiement[]>>("/paiements/collective", data);
    return response.data;
  },

  async updatePaiement(id: number, data: Partial<PaiementPayload>) {
    const response = await api.put<ApiResponse<Paiement>>(`/paiements/${id}`, data);
    return response.data;
  },

  async deletePaiement(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/paiements/${id}`);
    return response.data;
  },

  async annulerPaiement(id: number, motif: string) {
    const response = await api.post<ApiResponse<null>>(`/paiements/${id}/annuler`, { motif });
    return response.data;
  },

  async getPaiementsByPeriode(periodeId: number) {
    const response = await api.get<ApiResponse<Paiement[]>>(`/paiements`, {
      params: { periode_paie_id: periodeId, per_page: 100 },
    });
    return response.data;
  },
};

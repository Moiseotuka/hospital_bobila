import api from "@/lib/api";
import type { ApiResponse } from "@/types";

type RapportFilters = {
  mois?: number;
  annee?: number;
  date_debut?: string;
  date_fin?: string;
  statut?: string;
  per_page?: number;
  type?: string;
};

export const rapportService = {
  async getRapportBulletins(params?: RapportFilters) {
    if (params?.mois && params?.annee) {
      const response = await api.get<ApiResponse<Record<string, unknown>>>(`/rapports/mensuel/${params.mois}/${params.annee}`);
      return response.data;
    }
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/bulletins", {
      params: { ...params, per_page: params?.per_page || 100 },
    });
    return response.data;
  },

  async getRapportMasseSalariale(params?: RapportFilters) {
    const response = await api.get<ApiResponse<Record<string, unknown>>>("/rapports/masse-salariale", { params });
    return response.data;
  },

  async getRapportPaiements(params?: RapportFilters) {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/paiements", { params });
    return response.data;
  },

  async exportRapport(type: string, format: string, params?: RapportFilters) {
    const endpoint = format === "xlsx" ? "/rapports/export-excel" : "/rapports/export";
    const response = await api.get<Blob>(`${endpoint}/${type}`, {
      params,
      responseType: "blob",
    });
    return response.data;
  },
};

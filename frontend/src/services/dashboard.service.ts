import api from "@/lib/api";
import type { ApiResponse } from "@/types";

export const dashboardService = {
  async getDashboardData() {
    const response = await api.get<ApiResponse<Record<string, unknown>>>("/dashboard");
    return response.data;
  },

  async getEvolutionMensuelle(annee?: number) {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/dashboard/evolution-mensuelle", {
      params: { annee },
    });
    return response.data;
  },

  async getRepartitionGrades() {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/dashboard/repartition-grades");
    return response.data;
  },

  async getRepartitionDepartements() {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/dashboard/repartition-departements");
    return response.data;
  },

  async getDerniersPaiements() {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/dashboard/derniers-paiements");
    return response.data;
  },

  async getAlertes() {
    const response = await api.get<ApiResponse<Record<string, unknown>[]>>("/dashboard/alertes");
    return response.data;
  },
};

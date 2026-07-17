import api from "@/lib/api";

export const dashboardService = {
  async getDashboardData() {
    const response = await api.get("/dashboard");
    return response.data;
  },

  async getStatistiques(params?: any) {
    const response = await api.get("/dashboard/statistiques", { params });
    return response.data;
  },

  async getEvolutionMensuelle(params?: any) {
    const response = await api.get("/dashboard/evolution-mensuelle", { params });
    return response.data;
  },

  async getRepartitionGrades() {
    const response = await api.get("/dashboard/repartition-grades");
    return response.data;
  },

  async getRepartitionDepartements() {
    const response = await api.get("/dashboard/repartition-departements");
    return response.data;
  },

  async getDerniersPaiements(params?: any) {
    const response = await api.get("/dashboard/derniers-paiements", { params });
    return response.data;
  },

  async getAlertes() {
    const response = await api.get("/dashboard/alertes");
    return response.data;
  },
};

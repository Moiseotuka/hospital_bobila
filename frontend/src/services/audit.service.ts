import api from "@/lib/api";

export const auditService = {
  async getAuditLogs(params?: any) {
    const response = await api.get("/audit-logs", { params });
    return response.data;
  },

  async getAuditLog(id: number) {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  },
};

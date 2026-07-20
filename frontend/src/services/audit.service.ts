import api from "@/lib/api";
import type { AuditLog, ApiResponse, PaginatedResponse } from "@/types";

type AuditFilters = {
  search?: string;
  action?: string;
  module?: string;
  user_id?: number;
  model_type?: string;
  model_id?: number;
  date_debut?: string;
  date_fin?: string;
  page?: number;
  per_page?: number;
};

export const auditService = {
  async getAuditLogs(params?: AuditFilters) {
    const response = await api.get<PaginatedResponse<AuditLog>>("/audit-logs", { params });
    return response.data;
  },

  async getAuditLog(id: number) {
    const response = await api.get<ApiResponse<AuditLog>>(`/audit-logs/${id}`);
    return response.data;
  },
};

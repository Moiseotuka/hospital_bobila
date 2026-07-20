import api from "@/lib/api";
import type { Agent, ApiResponse, PaginatedResponse } from "@/types";

type AgentFilters = {
  search?: string;
  departement_id?: number;
  service_id?: number;
  grade_id?: number;
  fonction_id?: number;
  statut?: string;
  situation?: string;
  page?: number;
  per_page?: number;
};

type AgentPayload = Partial<Omit<Agent, "id" | "created_at" | "updated_at">>;

export const agentService = {
  async getAgents(params?: AgentFilters) {
    const response = await api.get<PaginatedResponse<Agent>>("/agents", { params });
    return response.data;
  },

  async getAgent(id: number) {
    const response = await api.get<ApiResponse<Agent>>(`/agents/${id}`);
    return response.data;
  },

  async createAgent(data: AgentPayload) {
    const response = await api.post<ApiResponse<Agent>>("/agents", data);
    return response.data;
  },

  async updateAgent(id: number, data: AgentPayload) {
    const response = await api.put<ApiResponse<Agent>>(`/agents/${id}`, data);
    return response.data;
  },

  async deleteAgent(id: number) {
    const response = await api.delete<ApiResponse<null>>(`/agents/${id}`);
    return response.data;
  },

  async restoreAgent(id: number) {
    const response = await api.post<ApiResponse<Agent>>(`/agents/${id}/restore`);
    return response.data;
  },

  async getAgentStats() {
    const response = await api.get<ApiResponse<Record<string, unknown>>>("/agents/stats");
    return response.data;
  },
};

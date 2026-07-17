import api from "@/lib/api";

export const paieService = {
  async getPeriodes(params?: any) {
    const response = await api.get("/periodes-paie", { params });
    return response.data;
  },

  async getPeriode(id: number) {
    const response = await api.get(`/periodes-paie/${id}`);
    return response.data;
  },

  async createPeriode(data: any) {
    const response = await api.post("/periodes-paie", data);
    return response.data;
  },

  async updatePeriode(id: number, data: any) {
    const response = await api.put(`/periodes-paie/${id}`, data);
    return response.data;
  },

  async deletePeriode(id: number) {
    const response = await api.delete(`/periodes-paie/${id}`);
    return response.data;
  },

  async genererBulletins(id: number) {
    const response = await api.post(`/periodes-paie/${id}/generer`);
    return response.data;
  },

  async validerPeriode(id: number) {
    const response = await api.post(`/periodes-paie/${id}/valider`);
    return response.data;
  },

  async verrouillerPeriode(id: number) {
    const response = await api.post(`/periodes-paie/${id}/verrouiller`);
    return response.data;
  },

  async getPeriodeCourante() {
    const response = await api.get("/periodes-paie/courante");
    return response.data;
  },
};

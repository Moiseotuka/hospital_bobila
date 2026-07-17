import api from "@/lib/api";

export const primeService = {
  async getPrimes(params?: any) {
    const response = await api.get("/primes", { params });
    return response.data;
  },

  async getPrime(id: number) {
    const response = await api.get(`/primes/${id}`);
    return response.data;
  },

  async createPrime(data: any) {
    const response = await api.post("/primes", data);
    return response.data;
  },

  async updatePrime(id: number, data: any) {
    const response = await api.put(`/primes/${id}`, data);
    return response.data;
  },

  async deletePrime(id: number) {
    const response = await api.delete(`/primes/${id}`);
    return response.data;
  },
};

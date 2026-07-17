import api from "@/lib/api";

export const userService = {
  async getUsers(params?: any) {
    const response = await api.get("/users", { params });
    return response.data;
  },

  async getUser(id: number) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  async createUser(data: any) {
    const response = await api.post("/users", data);
    return response.data;
  },

  async updateUser(id: number, data: any) {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  async deleteUser(id: number) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

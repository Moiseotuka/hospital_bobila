import api from "@/lib/api";
import { setToken, setUser, removeToken, removeUser } from "@/lib/auth";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post("/login", { email, password });
    const { token, user } = response.data;
    setToken(token);
    setUser(user);
    return response.data;
  },

  async logout() {
    try {
      await api.post("/logout");
    } finally {
      removeToken();
      removeUser();
    }
  },

  async getMe() {
    const response = await api.get("/me");
    return response.data;
  },

  async updateProfile(data: any) {
    const response = await api.put("/profile", data);
    return response.data;
  },
};

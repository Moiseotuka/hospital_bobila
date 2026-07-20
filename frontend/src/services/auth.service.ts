import api from "@/lib/api";
import { setToken, setUser, removeToken, removeUser } from "@/lib/auth";

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post<{
      success: boolean;
      data: { user: Record<string, unknown>; token: string; abilities: string[] };
    }>("/login", { email, password });
    const payload = response.data.data;
    setToken(payload.token);
    setUser(payload.user);
    return payload;
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
    const response = await api.get<{ success: boolean; data: Record<string, unknown> }>("/me");
    return response.data.data;
  },

  async updateProfile(data: Record<string, unknown>) {
    const response = await api.put<{ success: boolean; data: Record<string, unknown> }>("/profile", data);
    return response.data.data;
  },

  async forgotPassword(email: string) {
    const response = await api.post<{ success: boolean; message: string; token?: string }>("/forgot-password", { email });
    return response.data;
  },

  async resetPassword(email: string, token: string, password: string, passwordConfirmation: string) {
    const response = await api.post<{ success: boolean; message: string }>("/reset-password", {
      email, token, password, password_confirmation: passwordConfirmation,
    });
    return response.data;
  },
};

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(TOKEN_KEY, token);
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
  }
}

export function setUser(user: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getUser(): any | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function removeUser(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(USER_KEY);
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function logout(): void {
  removeToken();
  removeUser();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

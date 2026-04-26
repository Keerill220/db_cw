import { api } from "./client";
import type { AuthResponse, ChangePassword, MeResponse, ProfileUpdate } from "./types";

export const auth = {
  loginClient: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login/client", { email, password }).then((r) => r.data),
  loginAdmin: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login/admin", { email, password }).then((r) => r.data),
  register: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data),
  me: () => api.get<MeResponse>("/auth/me").then((r) => r.data),
  updateProfile: (data: ProfileUpdate) =>
    api.put<ProfileUpdate>("/auth/profile", data).then((r) => r.data),
  changePassword: (data: ChangePassword) =>
    api.post("/auth/change-password", data).then((r) => r.data),
};

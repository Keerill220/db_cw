import { api } from "./client";
import type { AuthResponse, ChangePassword, MeResponse, ProfileUpdate, RegisterInitiatedResponse } from "./types";

export const auth = {
  loginClient: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login/client", { email, password }).then((r) => r.data),
  loginAdmin: (email: string, password: string) =>
    api.post<AuthResponse>("/auth/login/admin", { email, password }).then((r) => r.data),
  initiateRegister: (data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) =>
    api.post<RegisterInitiatedResponse>("/auth/register", data).then((r) => r.data),
  verifyEmail: (email: string, code: string) =>
    api.post<AuthResponse>("/auth/verify-email", { email, code }).then((r) => r.data),
  resendVerification: (email: string) =>
    api.post("/auth/resend-verification", { email }).then((r) => r.data),
  me: () => api.get<MeResponse>("/auth/me").then((r) => r.data),
  updateProfile: (data: ProfileUpdate) =>
    api.put<ProfileUpdate>("/auth/profile", data).then((r) => r.data),
  changePassword: (data: ChangePassword) =>
    api.post("/auth/change-password", data).then((r) => r.data),
};

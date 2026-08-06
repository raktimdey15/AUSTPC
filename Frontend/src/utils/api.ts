import axios from "axios";

// In production the backend serves this bundle, so the API is same-origin.
// In dev the Vite server runs on :5173 while the API runs on :5000.
// VITE_API_BASE_URL overrides both (needed if you deploy them separately).
const baseURL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

export const api = axios.create({ baseURL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.sessionStorage.getItem("austpc_auth_token");
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  }

  return config;
});

export interface UploadedImage {
  id: string;
  url: string;
  category: string;
}

export interface AdminLoginResponse {
  token: string;
  username: string;
}

export interface BackendContentResponse {
  state: unknown;
  message?: string;
}

export interface ApplicationPayload {
  name: string;
  department: string;
  email: string;
  semester: string;
  phone: string;
  skills: string;
}

export interface ApplicationRecord extends ApplicationPayload {
  id: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  submittedAt: string;
}

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const { data } = await api.post<AdminLoginResponse>("/auth/login", { username, password });
  return data;
}

export async function saveSiteContent(state: unknown): Promise<void> {
  await api.put("/content", { state });
}

export async function submitApplication(application: ApplicationPayload): Promise<void> {
  await api.post("/applications", application);
}

// Admin-only: applications live in their own collection, never in public content.
export async function fetchApplications(): Promise<ApplicationRecord[]> {
  const { data } = await api.get<{ applications: ApplicationRecord[] }>("/applications");
  return data.applications;
}

export async function deleteApplication(id: string): Promise<void> {
  await api.delete(`/applications/${id}`);
}

export async function uploadImage(file: File, category = "general"): Promise<UploadedImage> {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("category", category);

  const { data } = await api.post<UploadedImage>("/uploads", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

export async function deleteImage(id: string): Promise<void> {
  await api.delete(`/uploads/${id}`);
}

import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

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

export async function adminLogin(username: string, password: string): Promise<AdminLoginResponse> {
  const { data } = await api.post<AdminLoginResponse>("/auth/login", { username, password });
  return data;
}

export async function saveSiteContent(state: unknown): Promise<void> {
  await api.put("/content", { state });
}

export async function submitApplication(application: ApplicationPayload): Promise<void> {
  await api.post("/content/applications", application);
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

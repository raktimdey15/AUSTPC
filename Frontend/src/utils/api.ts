import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
});

export interface UploadedImage {
  id: string;
  url: string;
  category: string;
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

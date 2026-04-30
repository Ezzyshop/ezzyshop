import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import { IUploadResponse } from "./upload.interface";

const MAX_DIMENSION = 1920;
const COMPRESSION_QUALITY = 0.82;
const COMPRESSION_THRESHOLD = 1 * 1024 * 1024; // only compress if > 1MB

async function compressImage(file: File): Promise<File> {
  // PDFs and non-image files — skip compression
  if (!file.type.startsWith("image/") || file.type === "image/gif") {
    return file;
  }

  // Small files don't need compression
  if (file.size <= COMPRESSION_THRESHOLD) {
    return file;
  }

  return new Promise((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;

      // Scale down if larger than max dimension
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // Compression made it larger or failed — use original
            resolve(file);
            return;
          }
          resolve(new File([blob], file.name, { type: "image/jpeg" }));
        },
        "image/jpeg",
        COMPRESSION_QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file); // fallback to original on error
    };

    img.src = objectUrl;
  });
}

export type UploadType = "product" | "category" | "cheque" | "logo";

export class UploadService {
  static async uploadImage(
    image: File,
    shopId: string,
    type: UploadType,
  ): Promise<IData<IUploadResponse>> {
    const compressed = await compressImage(image);

    const formData = new FormData();
    formData.append("image", compressed);
    formData.append("type", type);
    const response = await api.post(
      `/shops/${shopId}/upload/single`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  }
}

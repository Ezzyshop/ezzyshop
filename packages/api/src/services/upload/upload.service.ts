import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import { IUploadResponse } from "./upload.interface";

export class UploadService {
  static async uploadImage(image: File): Promise<IData<IUploadResponse>> {
    const formData = new FormData();
    formData.append("image", image);
    const response = await api.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

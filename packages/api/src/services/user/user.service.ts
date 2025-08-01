import { IData } from "../../utils/interfaces";
import { api } from "../../api";
import {
  ICheckUserExistsResponse,
  ICreateUserRequest,
  ILoginRequest,
  ILoginResponse,
  IUserResponse,
} from "./user.interface";

export class UserService {
  static async getUser(userId: string): Promise<IData<IUserResponse>> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  }

  static async getCurrentUser(): Promise<IData<IUserResponse>> {
    const response = await api.get(`/users/me/info`);
    return response.data;
  }

  static async checkUserExists(
    phone: string
  ): Promise<ICheckUserExistsResponse> {
    const response = await api.post(`/users/check-exists`, {
      phone,
    });
    return response.data;
  }

  static async loginUser(data: ILoginRequest): Promise<IData<ILoginResponse>> {
    const response = await api.post(`/auth/login`, data);
    return response;
  }

  static async logoutUser(): Promise<void> {
    await api.post(`/auth/logout`);
  }

  static async createUser(
    data: ICreateUserRequest
  ): Promise<IData<IUserResponse>> {
    const response = await api.post(`/auth/register`, data);
    return response;
  }
}

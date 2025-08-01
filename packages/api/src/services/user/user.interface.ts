import { UserRoles } from "./user.enum";

export interface IUserResponse {
  _id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  password: string;
  photo: string | null;
  roles: UserRoles[];
  shops: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ICheckUserExistsResponse {
  data: boolean;
}

export interface ILoginRequest {
  phone: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUserResponse;
}

export interface ICreateUserRequest {
  phone: string;
  password: string;
  full_name: string;
  confirm_password: string;
}
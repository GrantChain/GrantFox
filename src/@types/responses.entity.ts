export interface RoleResponse {
  role: string;
}

export interface AuthServiceResponse {
  success: boolean;
  message: string;
  data: RoleResponse | null;
}

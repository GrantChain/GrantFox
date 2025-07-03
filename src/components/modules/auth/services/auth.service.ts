import type {
  CheckRoleServiceResponse,
  GetUserRoleServiceResponse,
  GetUserServiceResponse,
  RegisterRoleServiceResponse,
  RegisterUserServiceResponse,
} from "@/@types/responses.entity";
import { extractErrorMessage } from "@/errors/mapping.utils";
import type {
  Grantee,
  PayoutProvider,
  User,
  UserRole,
} from "@/generated/prisma";
import { http } from "@/lib/axios";
class AuthService {
  async registerUser(
    user_id: string,
    email: string,
  ): Promise<RegisterUserServiceResponse> {
    try {
      const response = await http.post<{ user: User }>("/register-user", {
        user_id,
        email,
      });
      if (response.status === 201 && response.data.user) {
        return { success: true, user: response.data.user };
      }
      return {
        success: false,
        message: "Error registering user. Please try again.",
      };
    } catch (error: unknown) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  async registerRole(
    user_id: string,
    role: "PAYOUT_PROVIDER" | "GRANTEE",
  ): Promise<RegisterRoleServiceResponse> {
    try {
      const response = await http.post<{ user: User }>("/register-role", {
        user_id,
        role,
      });
      if (response.status === 200) {
        return { success: true, message: "Role registered successfully" };
      }
      return {
        success: false,
        message: "Error registering role. Please try again.",
      };
    } catch (error: unknown) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  async checkRole(user_id: string): Promise<CheckRoleServiceResponse> {
    try {
      const response = await http.get<{ role: string }>(
        `/check-role/${user_id}`,
      );
      if (response.status === 200 && response.data.role) {
        return { success: true, role: response.data.role };
      }
      return {
        success: false,
        message: "Error checking role. Please try again.",
      };
    } catch (error: unknown) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }

  async getUserByEmail(email: string): Promise<GetUserServiceResponse> {
    try {
      const response = await http.get<{ user: User }>(
        `/get-user-by-email?email=${encodeURIComponent(email)}&role=GRANTEE`,
      );
      return {
        exists: true,
        user: response.data.user,
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { data: GetUserServiceResponse };
        };
        return axiosError.response.data;
      }
      return { exists: false, message: "Failed to check user" };
    }
  }

  async getUserById(
    user_id: string,
    role: UserRole,
  ): Promise<GetUserServiceResponse> {
    try {
      const response = await http.get<{ user: User }>(
        `/get-user-by-id?user_id=${encodeURIComponent(user_id)}&role=${role}`,
      );
      return {
        exists: true,
        user: response.data.user,
      };
    } catch (error: unknown) {
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { data: GetUserServiceResponse };
        };
        return axiosError.response.data;
      }
      return { exists: false, message: "Failed to check user" };
    }
  }

  async getUserRoleById(
    user_id: string,
    role: UserRole,
  ): Promise<GetUserRoleServiceResponse> {
    try {
      const response = await http.get<{
        user: User | Grantee | PayoutProvider;
      }>(
        `/get-user-role-by-id?user_id=${encodeURIComponent(user_id)}&role=${role}`,
      );
      console.log("response", response.data.user);
      return {
        success: true,
        user: response.data.user,
      };
    } catch (error: unknown) {
      return { success: false, message: extractErrorMessage(error) };
    }
  }
}

export const authService = new AuthService();

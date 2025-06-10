import type { AuthServiceResponse } from "@/@types/responses.entity";
import type { RoleResponse } from "@/@types/responses.entity";
import type { User } from "@/generated/prisma";
import { http } from "@/lib/axios";

class AuthService {
  async registerUser(
    user_id: string,
    email: string,
  ): Promise<AuthServiceResponse> {
    try {
      const response = await http.post<User>("/register-user", {
        user_id,
        email,
      });

      if (response.status === 201) {
        return {
          success: true,
          message: "User registered successfully",
          data: response.data,
        };
      }

      return {
        success: false,
        message: "Error registering user. Please try again.",
        data: response.data,
      };
    } catch (error: unknown) {
      if (error instanceof Error && Object.hasOwn(error, "response")) {
        const axiosError = error as {
          response?: { data?: { message: string } };
        };
        return {
          success: false,
          message: axiosError.response?.data?.message || "An error occurred",
          data: null,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async registerRole(
    user_id: string,
    role: "PAYOUT_PROVIDER" | "GRANTEE",
  ): Promise<AuthServiceResponse> {
    try {
      const response = await http.post<RoleResponse>("/register-role", {
        user_id,
        role,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: "Role registered successfully",
          data: response.data,
        };
      }
      return {
        success: false,
        message: "Error registering role. Please try again.",
        data: null,
      };
    } catch (error: unknown) {
      if (error instanceof Error && Object.hasOwn(error, "response")) {
        const axiosError = error as {
          response?: { data?: { message: string } };
        };
        return {
          success: false,
          message:
            axiosError.response?.data?.message ||
            "An unexpected error occurred",
          data: null,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }

  async checkRole(user_id: string): Promise<AuthServiceResponse> {
    try {
      const response = await http.get<RoleResponse>(`/check-role/${user_id}`);
      if (response.status === 200) {
        return {
          success: true,
          message: "Role checked successfully",
          data: response.data,
        };
      }
      return {
        success: false,
        message: "Error checking role. Please try again.",
        data: null,
      };
    } catch (error: unknown) {
      if (error instanceof Error && Object.hasOwn(error, "response")) {
        const axiosError = error as {
          response?: { data?: { message: string } };
        };
        return {
          success: false,
          message:
            axiosError.response?.data?.message ||
            "An unexpected error occurred",
          data: null,
        };
      }
      return {
        success: false,
        message: "An unexpected error occurred",
        data: null,
      };
    }
  }
}

export const authService = new AuthService();

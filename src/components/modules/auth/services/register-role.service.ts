import { http } from "@/lib/axios";
import { AuthServiceResponse, RoleResponse } from "@/@types/responses.entity";

export const registerRole = async (
  user_id: string,
  role: "PAYOUT_PROVIDER" | "GRANTEE",
): Promise<AuthServiceResponse> => {
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
    } else {
      return {
        success: false,
        message: "Error registering role. Please try again.",
        data: null,
      };
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.hasOwnProperty("response")) {
      const axiosError = error as { response?: { data?: { message: string } } };
      return {
        success: false,
        message:
          axiosError.response?.data?.message || "An unexpected error occurred",
        data: null,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
      data: null,
    };
  }
};

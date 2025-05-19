import { RoleResponse, AuthServiceResponse } from "@/@types/responses.entity";
import { http } from "@/lib/axios";

export const checkRole = async (
  user_id: string,
): Promise<AuthServiceResponse> => {
  try {
    const response = await http.get<RoleResponse>(`/check-role/${user_id}`);
    if (response.status === 200) {
      return {
        success: true,
        message: "Role checked successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: "Error checking role. Please try again.",
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

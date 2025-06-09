import type { AuthServiceResponse } from "@/@types/responses.entity";
import type { User } from "@/generated/prisma";
import { http } from "@/lib/axios";

// This function is used to register a user in the "PUBLIC" User Table
export const registerUser = async (
  user_id: string,
  email: string,
): Promise<AuthServiceResponse> => {
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
    } else {
      return {
        success: false,
        message: "Error registering user. Please try again.",
        data: response.data,
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

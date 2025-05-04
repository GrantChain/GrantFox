export const registerRole = async (user_id: string, role: "grant_provider" | "grantee") => {
    try {
      const response = await fetch('/api/register-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id, role }),
      });
  
      if (response.status === 200) {
        return {
          success: true,
          message: "Role registered successfully",
          data: await response.json(),
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
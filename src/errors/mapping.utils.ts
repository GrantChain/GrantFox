export function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response: { data: { error: string } } }).response?.data
      ?.error === "string"
  ) {
    return (error as { response: { data: { error: string } } }).response.data
      .error;
  }
  return "An unexpected error occurred";
}

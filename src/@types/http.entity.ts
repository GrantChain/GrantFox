export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type Status = "SUCCESS" | "ERROR";

export interface ApiRequest<T = unknown> {
  method: HttpMethod;
  url: string;
  data?: T;
  params?: Record<string, any>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

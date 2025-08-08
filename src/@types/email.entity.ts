export interface EmailData {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export interface EmailPayload {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text: string;
}

export interface EmailResponse {
  success: boolean;
  data?: string;
  error?: string;
}

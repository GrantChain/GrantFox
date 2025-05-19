import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("The email is not valid"),
  password: z
    .string()
    .min(8, "The password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(
      /[@$!%*?&]/,
      "Must contain at least one special character (@$!%*?&)",
    ),
});

import { z } from "zod";

export const generalInfoSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  wallet_address: z
    .string()
    .min(1, "Wallet address is required")
    .refine(
      (val) => {
        const regex = /^G[A-Z2-7]{55}$/;
        return regex.test(val);
      },
      { message: "Please enter a valid Stellar wallet address" },
    ),
  location: z.string().optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  profile_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  cover_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
});

export const grantProviderSchema = z.object({
  organization_name: z
    .string()
    .min(1, "Organization name is required")
    .max(100, "Organization name must be less than 100 characters"),
  network_type: z.string().optional().or(z.literal("")),
  email: z.string().optional().or(z.literal("")),
});

export const granteeSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  position_title: z
    .string()
    .max(100, "Position title must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;
export type GrantProviderFormData = z.infer<typeof grantProviderSchema>;
export type GranteeFormData = z.infer<typeof granteeSchema>;

// Payload schema for the /api/profile endpoint
export const profileUpdatePayloadSchema = z.object({
  userId: z.string().min(1),
  user: generalInfoSchema.partial(),
  grantee: z
    .object({
      name: z.string().max(100).optional(),
      position_title: z.string().max(100).optional(),
      social_media: z.record(z.string(), z.string()).nullable().optional(),
    })
    .optional(),
  grantProvider: grantProviderSchema.partial().optional(),
});

export type ProfileUpdatePayload = z.infer<typeof profileUpdatePayloadSchema>;

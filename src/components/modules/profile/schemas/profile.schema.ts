import { z } from 'zod';

export const generalInfoSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  wallet_address: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val) return true;
        const regex = /^G[A-Z2-7]{55}$/;
        return regex.test(val);
      },
      { message: 'Please enter a valid Stellar wallet address' },
    ),
  location: z.string().optional().or(z.literal('')),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  profile_url: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL',
    }),
  cover_url: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Please enter a valid URL',
    }),
});

export type GeneralInfoFormData = z.infer<typeof generalInfoSchema>;

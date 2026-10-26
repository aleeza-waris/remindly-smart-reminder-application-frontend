import { z } from 'zod';

const emailSchema = z
  .string()
  .trim()
  .email('Enter a valid email address.')
  .max(254, 'Email addresses must be 254 characters or fewer.');

const hasValidPasswordLength = (password: string) =>
  new TextEncoder().encode(password).length <= 72;

export const loginSchema = z
  .object({
    name: z.string().trim().optional(),
    email: emailSchema,
    password: z.string().min(1, 'Please enter your password.'),
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ password }, context) => {
    if (!hasValidPasswordLength(password)) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password is too long. Please use a shorter password.',
      });
    }
  });

export const registerSchema = z
  .object({
    name: z.string().trim().optional(),
    email: emailSchema,
    password: z.string({ error: 'Please enter your password.' }),
    confirmPassword: z.string().optional(),
  })
  .superRefine(({ name, password, confirmPassword }, context) => {
    if (!name || name.length < 1) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Enter your name.',
      });
    } else if (name.length > 100) {
      context.addIssue({
        code: 'custom',
        path: ['name'],
        message: 'Names must be 100 characters or fewer.',
      });
    }

    if (password.length === 0) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Please enter your password.',
      });
    } else if (password.length < 8) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password must be at least 8 characters long.',
      });
    }

    if (!hasValidPasswordLength(password)) {
      context.addIssue({
        code: 'custom',
        path: ['password'],
        message: 'Password is too long. Please use a shorter password.',
      });
    }

    if (confirmPassword !== password) {
      context.addIssue({
        code: 'custom',
        path: ['confirmPassword'],
        message: 'Passwords do not match.',
      });
    }
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

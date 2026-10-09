import { z } from 'zod';

const adminSignupValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
    adminSecret: z.string().optional(),
  }),
});

const adminLoginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const updateUserRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(['user', 'admin', 'driver', 'transportation-manager'], {
      required_error: 'Role must be user, admin, driver, or transportation-manager',
    }),
  }),
});

const banUserValidationSchema = z.object({
  body: z.object({
    banned: z.boolean({ required_error: 'banned boolean is required' }),
    banReason: z.string().optional(),
  }),
});

export const AdminValidation = {
  adminSignupValidationSchema,
  adminLoginValidationSchema,
  updateUserRoleValidationSchema,
  banUserValidationSchema,
};

export default AdminValidation;

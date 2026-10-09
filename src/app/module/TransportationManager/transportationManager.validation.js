import { z } from 'zod';

const managerSignupValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(2, 'Name must be at least 2 characters'),
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }).min(6, 'Password must be at least 6 characters'),
  }),
});

const managerLoginValidationSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email('Invalid email address'),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

const managerUpdateProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    image: z.string().url().optional(),
  }),
});

export const TransportationManagerValidation = {
  managerSignupValidationSchema,
  managerLoginValidationSchema,
  managerUpdateProfileValidationSchema,
};

export default TransportationManagerValidation;

import { z } from 'zod';

const createRouteValidationSchema = z.object({
  body: z.object({
    routeName: z.string({ required_error: 'Route name is required' }).min(1),
    startPoint: z.string({ required_error: 'Start point is required' }).min(1),
    endPoint: z.string({ required_error: 'End point is required' }).min(1),
    stops: z.array(z.string()).optional(),
    scheduleTimes: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

const updateRouteValidationSchema = z.object({
  body: z.object({
    routeName: z.string().min(1).optional(),
    startPoint: z.string().min(1).optional(),
    endPoint: z.string().min(1).optional(),
    stops: z.array(z.string()).optional(),
    scheduleTimes: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']).optional(),
  }),
});

export const RouteValidation = {
  createRouteValidationSchema,
  updateRouteValidationSchema,
};

export default RouteValidation;

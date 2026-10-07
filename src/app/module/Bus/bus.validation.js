import { z } from 'zod';

const createBusValidationSchema = z.object({
  body: z.object({
    busNumber: z.string({ required_error: 'Bus number is required' }).min(1),
    name: z.string({ required_error: 'Bus name is required' }).min(1),
    licensePlate: z.string({ required_error: 'License plate is required' }).min(1),
    capacity: z.number({ required_error: 'Capacity is required' }).min(1),
    status: z.enum(['active', 'maintenance', 'inactive']).optional(),
    assignedDriver: z.string().optional().nullable(),
    assignedRoute: z.string().optional().nullable(),
  }),
});

const updateBusValidationSchema = z.object({
  body: z.object({
    busNumber: z.string().min(1).optional(),
    name: z.string().min(1).optional(),
    licensePlate: z.string().min(1).optional(),
    capacity: z.number().min(1).optional(),
    status: z.enum(['active', 'maintenance', 'inactive']).optional(),
    assignedDriver: z.string().optional().nullable(),
    assignedRoute: z.string().optional().nullable(),
  }),
});

const assignDriverValidationSchema = z.object({
  body: z.object({
    driverId: z.string({ required_error: 'driverId is required' }).nullable(),
  }),
});

const assignRouteValidationSchema = z.object({
  body: z.object({
    routeId: z.string({ required_error: 'routeId is required' }).nullable(),
  }),
});

export const BusValidation = {
  createBusValidationSchema,
  updateBusValidationSchema,
  assignDriverValidationSchema,
  assignRouteValidationSchema,
};

export default BusValidation;

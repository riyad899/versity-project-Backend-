import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import RouteController from './route.controller.js';
import RouteValidation from './route.validation.js';

const router = Router();

// Create route (Transportation Manager & Admin)
router.post(
  '/',
  checkAuth('transportation-manager', 'admin'),
  validateReq(RouteValidation.createRouteValidationSchema),
  RouteController.createRoute
);

// Get all routes (Accessible by all authenticated users: passengers, drivers, managers, admins)
router.get(
  '/',
  checkAuth('user', 'driver', 'transportation-manager', 'admin'),
  RouteController.getAllRoutes
);

// Get single route by ID
router.get(
  '/:id',
  checkAuth('user', 'driver', 'transportation-manager', 'admin'),
  RouteController.getRouteById
);

// Update route (Transportation Manager & Admin)
router.patch(
  '/:id',
  checkAuth('transportation-manager', 'admin'),
  validateReq(RouteValidation.updateRouteValidationSchema),
  RouteController.updateRoute
);

// Delete route (Transportation Manager & Admin)
router.delete(
  '/:id',
  checkAuth('transportation-manager', 'admin'),
  RouteController.deleteRoute
);

export const RouteRoutes = router;
export default RouteRoutes;

import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import BusController from './bus.controller.js';
import BusValidation from './bus.validation.js';

const router = Router();

// Create new bus (Transportation Manager & Admin)
router.post(
  '/',
  checkAuth('transportation-manager', 'admin'),
  validateReq(BusValidation.createBusValidationSchema),
  BusController.createBus
);

// Get all buses (Accessible by passenger, driver, manager, admin)
router.get(
  '/',
  checkAuth('user', 'driver', 'transportation-manager', 'admin'),
  BusController.getAllBuses
);

// Get single bus by ID
router.get(
  '/:id',
  checkAuth('user', 'driver', 'transportation-manager', 'admin'),
  BusController.getBusById
);

// Update bus details (Transportation Manager & Admin)
router.patch(
  '/:id',
  checkAuth('transportation-manager', 'admin'),
  validateReq(BusValidation.updateBusValidationSchema),
  BusController.updateBus
);

// Assign/unassign driver to bus (Transportation Manager & Admin)
router.patch(
  '/:id/assign-driver',
  checkAuth('transportation-manager', 'admin'),
  validateReq(BusValidation.assignDriverValidationSchema),
  BusController.assignDriver
);

// Assign/unassign route to bus (Transportation Manager & Admin)
router.patch(
  '/:id/assign-route',
  checkAuth('transportation-manager', 'admin'),
  validateReq(BusValidation.assignRouteValidationSchema),
  BusController.assignRoute
);

// Delete bus (Transportation Manager & Admin)
router.delete(
  '/:id',
  checkAuth('transportation-manager', 'admin'),
  BusController.deleteBus
);

export const BusRoutes = router;
export default BusRoutes;

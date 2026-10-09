import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import TransportationManagerController from './transportationManager.controller.js';
import TransportationManagerValidation from './transportationManager.validation.js';

const router = Router();

// Public Auth endpoints
router.post(
  '/signup',
  validateReq(TransportationManagerValidation.managerSignupValidationSchema),
  TransportationManagerController.signupManager
);

router.post(
  '/login',
  validateReq(TransportationManagerValidation.managerLoginValidationSchema),
  TransportationManagerController.loginManager
);

// Protected Manager Profile endpoints
router.get(
  '/me',
  checkAuth('transportation-manager', 'admin'),
  TransportationManagerController.getManagerProfile
);

router.patch(
  '/update-me',
  checkAuth('transportation-manager', 'admin'),
  validateReq(TransportationManagerValidation.managerUpdateProfileValidationSchema),
  TransportationManagerController.updateManagerProfile
);

// Protected Driver list for Manager
router.get(
  '/drivers',
  checkAuth('transportation-manager', 'admin'),
  TransportationManagerController.getAllDrivers
);

export const TransportationManagerRoutes = router;
export default TransportationManagerRoutes;

import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import DriverController from './driver.controller.js';
import DriverValidation from './driver.validation.js';

const router = Router();

// Public Driver Auth endpoints
router.post(
  '/signup',
  validateReq(DriverValidation.driverSignupValidationSchema),
  DriverController.signupDriver
);

router.post(
  '/login',
  validateReq(DriverValidation.driverLoginValidationSchema),
  DriverController.loginDriver
);

router.get(
  '/',
  checkAuth('transportation-manager', 'admin'),
  DriverController.getAllDrivers
);

// Protected Driver Profile endpoints
router.get(
  '/me',
  checkAuth('driver', 'admin'),
  DriverController.getDriverProfile
);

router.patch(
  '/update-me',
  checkAuth('driver', 'admin'),
  validateReq(DriverValidation.driverUpdateProfileValidationSchema),
  DriverController.updateDriverProfile
);

export const DriverRoutes = router;
export default DriverRoutes;

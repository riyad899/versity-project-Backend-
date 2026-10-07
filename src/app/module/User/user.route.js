import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import UserController from './user.controller.js';
import UserValidation from './user.validation.js';

const router = Router();

// Public User Auth endpoints
router.post(
  '/signup',
  validateReq(UserValidation.userSignupValidationSchema),
  UserController.signupUser
);

router.post(
  '/login',
  validateReq(UserValidation.userLoginValidationSchema),
  UserController.loginUser
);

// Protected User Profile endpoints
router.get(
  '/me',
  checkAuth('user', 'admin'),
  UserController.getMyProfile
);

router.patch(
  '/update-me',
  checkAuth('user', 'admin'),
  validateReq(UserValidation.updateProfileValidationSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;
export default UserRoutes;

import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import getAuth from '../../lib/auth.js';
import AuthController from './auth.controller.js';
import AuthValidation from './auth.validation.js';

const router = Router();

// Custom convenience endpoints
router.post(
  '/register',
  validateReq(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  '/login',
  validateReq(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);

router.get(
  '/me',
  checkAuth('user','driver', 'transportation-manager', 'admin'),
  AuthController.getMe
);

// Native Better Auth express route handler (mounts /sign-up/email, /sign-in/email, /sign-out, etc.)

 // Native Better Auth express route handler
const handler = toNodeHandler(getAuth());

router.all('*', (req, res) => {
  return handler(req, res);
});


export const AuthRoutes = router;
export default AuthRoutes;

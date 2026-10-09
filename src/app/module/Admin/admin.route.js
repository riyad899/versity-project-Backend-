import { Router } from 'express';
import checkAuth from '../../../middleware/checkAuth.js';
import validateReq from '../../../middleware/validateReq.js';
import AdminController from './admin.controller.js';
import AdminValidation from './admin.validation.js';

const router = Router();

// Admin Authentication Endpoints
router.post(
  '/signup',
  validateReq(AdminValidation.adminSignupValidationSchema),
  AdminController.signupAdmin
);

router.post(
  '/login',
  validateReq(AdminValidation.adminLoginValidationSchema),
  AdminController.loginAdmin
);

// Dashboard Statistics (Admin Only)
router.get(
  '/stats',
  checkAuth('admin'),
  AdminController.getDashboardStats
);

// Account Management: Passengers, Drivers, Transportation Managers, Admins (Admin Only)
router.get(
  '/users',
  checkAuth('admin'),
  AdminController.getAllUsers
);

router.get(
  '/users/:id',
  checkAuth('admin'),
  AdminController.getUserById
);

router.patch(
  '/users/:id',
  checkAuth('admin'),
  AdminController.updateUser
);

// Role Management Endpoints (Admin Only)
router.patch(
  '/users/:id/role',
  checkAuth('admin'),
  validateReq(AdminValidation.updateUserRoleValidationSchema),
  AdminController.updateUserRole
);

router.patch(
  '/users/:id/change-role',
  checkAuth('admin'),
  validateReq(AdminValidation.updateUserRoleValidationSchema),
  AdminController.updateUserRole
);

router.patch(
  '/users/:id/make-driver',
  checkAuth('admin'),
  AdminController.makeDriver
);

router.patch(
  '/users/:id/make-transportation-manager',
  checkAuth('admin'),
  AdminController.makeTransportationManager
);

router.patch(
  '/users/:id/make-user',
  checkAuth('admin'),
  AdminController.makeUser
);

router.patch(
  '/users/:id/make-admin',
  checkAuth('admin'),
  AdminController.makeAdmin
);

router.patch(
  '/users/:id/ban',
  checkAuth('admin'),
  validateReq(AdminValidation.banUserValidationSchema),
  AdminController.banUser
);

router.delete(
  '/users/:id',
  checkAuth('admin'),
  AdminController.deleteUser
);

export const AdminRoutes = router;
export default AdminRoutes;

import { fromNodeHeaders } from 'better-auth/node';
import setAuthCookies from '../../utils/cookieHelper.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import AdminService from './admin.service.js';

const signupAdmin = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.signupAdmin(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Admin account created successfully!',
    data: result,
  });
});

const loginAdmin = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.loginAdmin(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin logged in successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await AdminService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully!',
    data: result,
  });
});

const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.getUserById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully!',
    data: result,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateUser(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User account updated successfully!',
    data: result,
  });
});

const updateUserRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.updateUserRole(id, role, headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `User role updated to ${role} successfully!`,
    data: result,
  });
});

const makeDriver = catchAsync(async (req, res) => {
  const { id } = req.params;
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.updateUserRole(id, 'driver', headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User successfully promoted to Driver!',
    data: result,
  });
});

const makeTransportationManager = catchAsync(async (req, res) => {
  const { id } = req.params;
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.updateUserRole(id, 'transportation-manager', headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User successfully promoted to Transportation Manager!',
    data: result,
  });
});

const makeUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.updateUserRole(id, 'user', headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User role successfully set to Passenger/User!',
    data: result,
  });
});

const makeAdmin = catchAsync(async (req, res) => {
  const { id } = req.params;
  const headers = fromNodeHeaders(req.headers);
  const result = await AdminService.updateUserRole(id, 'admin', headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User successfully promoted to Admin!',
    data: result,
  });
});

const banUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.banUser(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: req.body.banned ? 'User banned successfully!' : 'User unbanned successfully!',
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteUser(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully!',
    data: result,
  });
});

const getDashboardStats = catchAsync(async (req, res) => {
  const result = await AdminService.getDashboardStats();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Dashboard statistics retrieved successfully!',
    data: result,
  });
});

export const AdminController = {
  signupAdmin,
  loginAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  makeDriver,
  makeTransportationManager,
  makeUser,
  makeAdmin,
  banUser,
  deleteUser,
  getDashboardStats,
};

export default AdminController;

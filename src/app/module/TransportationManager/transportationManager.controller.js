import { fromNodeHeaders } from 'better-auth/node';
import setAuthCookies from '../../utils/cookieHelper.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import TransportationManagerService from './transportationManager.service.js';

const signupManager = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await TransportationManagerService.signupManager(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Transportation Manager registered successfully!',
    data: result,
  });
});

const loginManager = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await TransportationManagerService.loginManager(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Transportation Manager logged in successfully!',
    data: result,
  });
});

const getManagerProfile = catchAsync(async (req, res) => {
  const managerId = req.user.id || req.user._id;
  const result = await TransportationManagerService.getManagerProfile(managerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Manager profile fetched successfully!',
    data: result,
  });
});

const updateManagerProfile = catchAsync(async (req, res) => {
  const managerId = req.user.id || req.user._id;
  const result = await TransportationManagerService.updateManagerProfile(managerId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Manager profile updated successfully!',
    data: result,
  });
});

const getAllDrivers = catchAsync(async (req, res) => {
  const result = await TransportationManagerService.getAllDrivers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Drivers fetched successfully!',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await TransportationManagerService.getAllUsers(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users fetched successfully!',
    data: result,
  });
});

const makeUserDriver = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await TransportationManagerService.makeUserDriver(req.params.id, headers);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User promoted to Driver successfully!',
    data: result,
  });
});

export const TransportationManagerController = {
  signupManager,
  loginManager,
  getManagerProfile,
  updateManagerProfile,
  getAllDrivers,
  getAllUsers,
  makeUserDriver,
};

export default TransportationManagerController;

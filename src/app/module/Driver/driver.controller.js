import { fromNodeHeaders } from 'better-auth/node';
import setAuthCookies from '../../utils/cookieHelper.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import DriverService from './driver.service.js';

const signupDriver = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await DriverService.signupDriver(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Driver account created successfully!',
    data: result,
  });
});

const loginDriver = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await DriverService.loginDriver(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver logged in successfully!',
    data: result,
  });
});

const getDriverProfile = catchAsync(async (req, res) => {
  const driverId = req.user.id || req.user._id;
  const result = await DriverService.getDriverProfile(driverId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile fetched successfully!',
    data: result,
  });
});

const updateDriverProfile = catchAsync(async (req, res) => {
  const driverId = req.user.id || req.user._id;
  const result = await DriverService.updateDriverProfile(driverId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Driver profile updated successfully!',
    data: result,
  });
});


const getAllDrivers = catchAsync(async (req, res) => {
  const result = await DriverService.getAllDriversFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All drivers fetched successfully!',
    data: result,
  });
});


export const DriverController = {
  signupDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
  getAllDrivers,
};

export default DriverController;

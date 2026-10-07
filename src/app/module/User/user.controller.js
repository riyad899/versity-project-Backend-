import { fromNodeHeaders } from 'better-auth/node';
import setAuthCookies from '../../utils/cookieHelper.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import UserService from './user.service.js';

const signupUser = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await UserService.signupUser(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await UserService.loginUser(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully!',
    data: result,
  });
});

const getMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const result = await UserService.getMyProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const result = await UserService.updateMyProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile updated successfully!',
    data: result,
  });
});

export const UserController = {
  signupUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};

export default UserController;

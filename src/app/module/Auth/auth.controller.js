import { fromNodeHeaders } from 'better-auth/node';
import setAuthCookies from '../../utils/cookieHelper.js';
import catchAsync from '../../shared/catchAsync.js';
import sendResponse from '../../shared/sendResponse.js';
import AuthService from './auth.service.js';

const registerUser = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await AuthService.registerUser(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'User registered successfully via Better Auth!',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const headers = fromNodeHeaders(req.headers);
  const result = await AuthService.loginUser(req.body, headers);

  setAuthCookies(res, result.cookieHeader, result.token);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully via Better Auth!',
    data: result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const result = await AuthService.getMe(req.user);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile fetched successfully!',
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  getMe,
};

export default AuthController;

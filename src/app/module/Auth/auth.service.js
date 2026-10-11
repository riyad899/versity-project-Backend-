import AppError from '../../errorHelpers/appError.js';
import getAuth from '../../lib/auth.js';
import { User } from './auth.model.js';

const registerUser = async (body, headers) => {
  const { email, password, name, role } = body;
  const auth = getAuth();

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, 'User with this email already exists!');
  }

  const authRes = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
    },
    headers,
    asResponse: true,
  });

  const responseData = await authRes.json();

  if (!authRes.ok) {
    throw new AppError(authRes.status || 400, responseData?.message || 'Failed to create account!');
  }

  const cookieHeader = authRes.headers.get('set-cookie');

  if (role && role !== 'user') {
    await User.findOneAndUpdate({ email }, { role });
  }

  const createdUser = await User.findOne({ email });

  return {
    ...responseData,
    user: {
      ...responseData.user,
      ...createdUser?.toObject(),
      id: createdUser?._id?.toString() || responseData.user?.id,
      role: createdUser?.role || 'user',
    },
    cookieHeader,
  };
};

const loginUser = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User with this email not found!');
  }

  if (user.banned) {
    throw new AppError(403, `Account is banned: ${user.banReason || 'Contact support'}`);
  }

  const authRes = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers,
    asResponse: true,
  });

  const responseData = await authRes.json();

  if (!authRes.ok) {
    throw new AppError(authRes.status || 401, responseData?.message || 'Invalid email or password!');
  }

  const cookieHeader = authRes.headers.get('set-cookie');

  return {
    ...responseData,
    user: {
      ...responseData.user,
      ...user.toObject(),
      id: user._id.toString(),
      role: user.role || 'user',
    },
    cookieHeader,
  };
};

const getMe = async (user) => {
  return user;
};

export const AuthService = {
  registerUser,
  loginUser,
  getMe,
};

export default AuthService;

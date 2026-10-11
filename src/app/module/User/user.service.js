import AppError from '../../errorHelpers/appError.js';
import getAuth from '../../lib/auth.js';
import { User } from '../../../schema/index.js';

const signupUser = async (body, headers) => {
  const { name, email, password } = body;
  const auth = getAuth();

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, 'User with this email already exists!');
  }

  // Register user via Better Auth (defaults to role: 'user')
  const authRes = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
    headers,
    asResponse: true,
  });

  const responseData = await authRes.json();
  if (!authRes.ok) {
    throw new AppError(authRes.status || 400, responseData?.message || 'Failed to create user account!');
  }
  const cookieHeader = authRes.headers.get('set-cookie');

  return {
    ...responseData,
    cookieHeader,
  };
};

const loginUser = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'User not found!');
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
    cookieHeader,
  };
};

const getMyProfile = async (userId) => {
  const user = await User.findById(userId).select('-__v');
  if (!user) {
    throw new AppError(404, 'User not found!');
  }
  return user;
};

const updateMyProfile = async (userId, payload) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select('-__v');

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  return user;
};

export const UserService = {
  signupUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};

export default UserService;

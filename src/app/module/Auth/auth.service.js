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

  const cookieHeader = authRes.headers.get('set-cookie');
  const responseData = await authRes.json();

  if (body.role && body.role !== 'user') {
    await User.findOneAndUpdate({ email }, { role: body.role });
  }

  return {
    ...responseData,
    cookieHeader,
  };
};

const loginUser = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const authRes = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers,
    asResponse: true,
  });

  const cookieHeader = authRes.headers.get('set-cookie');
  const responseData = await authRes.json();

  return {
    ...responseData,
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

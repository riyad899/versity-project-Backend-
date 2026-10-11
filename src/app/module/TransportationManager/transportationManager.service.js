import AppError from '../../errorHelpers/appError.js';
import getAuth from '../../lib/auth.js';
import { User } from '../../../schema/index.js';

const signupManager = async (body, headers) => {
  const { name, email, password } = body;
  const auth = getAuth();

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, 'Transportation Manager with this email already exists!');
  }

  // Register manager via Better Auth
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
    throw new AppError(authRes.status || 400, responseData?.message || 'Failed to register transportation manager!');
  }
  const cookieHeader = authRes.headers.get('set-cookie');

  // Assign transportation-manager role
  await User.findOneAndUpdate({ email }, { role: 'transportation-manager' });

  return {
    ...responseData,
    cookieHeader,
  };
};

const loginManager = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'Transportation Manager account not found!');
  }

  if (user.role !== 'transportation-manager' && user.role !== 'admin') {
    throw new AppError(403, 'Access denied! You do not have transportation-manager privileges.');
  }

  if (user.banned) {
    throw new AppError(403, `Manager account is suspended: ${user.banReason || 'Contact support'}`);
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

const getManagerProfile = async (managerId) => {
  const manager = await User.findById(managerId).select('-__v');
  if (!manager) {
    throw new AppError(404, 'Manager not found!');
  }
  return manager;
};

const updateManagerProfile = async (managerId, payload) => {
  const manager = await User.findByIdAndUpdate(managerId, payload, {
    new: true,
    runValidators: true,
  }).select('-__v');

  if (!manager) {
    throw new AppError(404, 'Manager not found!');
  }

  return manager;
};

const getAllDrivers = async () => {
  const drivers = await User.find({ role: 'driver' }).select('-__v').sort({ createdAt: -1 });
  return drivers;
};

const getAllUsers = async (query = {}) => {
  const filter = { role: 'user' };
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  const users = await User.find(filter).select('-__v').sort({ createdAt: -1 });
  return users;
};

const makeUserDriver = async (userId, headers) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }
  user.role = 'driver';
  await user.save();

  try {
    const auth = getAuth();
    if (auth.api.setRole && headers) {
      await auth.api.setRole({
        body: { userId, role: 'driver' },
        headers,
      });
    }
  } catch (err) {
    // Non-blocking fallback
  }

  return user;
};

export const TransportationManagerService = {
  signupManager,
  loginManager,
  getManagerProfile,
  updateManagerProfile,
  getAllDrivers,
  getAllUsers,
  makeUserDriver,
};

export default TransportationManagerService;

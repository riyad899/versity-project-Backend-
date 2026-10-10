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

  const cookieHeader = authRes.headers.get('set-cookie');
  const responseData = await authRes.json();

  // Assign transportation-manager role
const updatedManager = await User.findOneAndUpdate(
  { email: email.toLowerCase() },
  { $set: { role: 'transportation-manager' } },
  { new: true, runValidators: true }
);

if (!updatedManager) {
  throw new AppError(500, 'Failed to assign transportation-manager role!');
}

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

  const cookieHeader = authRes.headers.get('set-cookie');
  const responseData = await authRes.json();

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

export const TransportationManagerService = {
  signupManager,
  loginManager,
  getManagerProfile,
  updateManagerProfile,
  getAllDrivers,
};

export default TransportationManagerService;

import AppError from '../../errorHelpers/appError.js';
import getAuth from '../../lib/auth.js';
import { User } from '../../../schema/index.js';

const signupDriver = async (body, headers) => {
  const { name, email, password } = body;
  const auth = getAuth();

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, 'Driver with this email already exists!');
  }

  // Register driver via Better Auth
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

  // Assign driver role
  await User.findOneAndUpdate({ email }, { role: 'driver' });

  return {
    ...responseData,
    cookieHeader,
  };
};

const loginDriver = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'Driver not found!');
  }

  if (user.role !== 'driver' && user.role !== 'admin') {
    throw new AppError(403, 'Access denied! You do not have a driver account.');
  }

  if (user.banned) {
    throw new AppError(403, `Driver account is suspended: ${user.banReason || 'Contact support'}`);
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

const getDriverProfile = async (driverId) => {
  const driver = await User.findById(driverId).select('-__v');
  if (!driver) {
    throw new AppError(404, 'Driver not found!');
  }
  return driver;
};

const updateDriverProfile = async (driverId, payload) => {
  const driver = await User.findByIdAndUpdate(driverId, payload, {
    new: true,
    runValidators: true,
  }).select('-__v');

  if (!driver) {
    throw new AppError(404, 'Driver not found!');
  }

  return driver;
};

export const DriverService = {
  signupDriver,
  loginDriver,
  getDriverProfile,
  updateDriverProfile,
};

export default DriverService;

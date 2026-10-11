import AppError from '../../errorHelpers/appError.js';
import getAuth from '../../lib/auth.js';
import { Bus, RouteModel, User } from '../../../schema/index.js';

const signupAdmin = async (body, headers) => {
  const { name, email, password } = body;
  const auth = getAuth();

  const isUserExist = await User.findOne({ email });
  if (isUserExist) {
    throw new AppError(400, 'User with this email already exists!');
  }

  // Register admin user
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
    throw new AppError(authRes.status || 400, responseData?.message || 'Failed to register admin!');
  }
  const cookieHeader = authRes.headers.get('set-cookie');

  // Ensure role is updated to admin in database
  await User.findOneAndUpdate({ email }, { role: 'admin' });

  return {
    ...responseData,
    cookieHeader,
  };
};

const loginAdmin = async (body, headers) => {
  const { email, password } = body;
  const auth = getAuth();

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, 'Admin not found!');
  }

  if (user.role !== 'admin') {
    throw new AppError(403, 'Access denied! You do not have admin privileges.');
  }

  if (user.banned) {
    throw new AppError(403, `Admin account is suspended: ${user.banReason || 'Contact support'}`);
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

const getAllUsers = async (query = {}) => {
  const filter = {};

  if (query.role) {
    filter.role = query.role;
  }

  if (query.banned !== undefined) {
    filter.banned = query.banned === 'true' || query.banned === true;
  }

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter).select('-__v').sort({ createdAt: -1 });
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id).select('-__v');
  if (!user) {
    throw new AppError(404, 'User not found!');
  }
  return user;
};

const updateUser = async (id, payload) => {
  const allowedUpdates = ['name', 'image', 'role', 'emailVerified'];
  const updateData = {};

  for (const key of allowedUpdates) {
    if (payload[key] !== undefined) {
      updateData[key] = payload[key];
    }
  }

  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-__v');

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  return user;
};

const updateUserRole = async (id, role, headers) => {
  const allowedRoles = ['user', 'admin', 'driver', 'transportation-manager'];
  if (!allowedRoles.includes(role)) {
    throw new AppError(400, `Invalid role: ${role}. Allowed roles are: ${allowedRoles.join(', ')}`);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  // Sync role update with Better Auth
  try {
    const auth = getAuth();
    if (auth.api.setRole && headers) {
      await auth.api.setRole({
        body: { userId: id, role },
        headers,
      });
    }
  } catch (err) {
    // Non-blocking fallback
  }

  return user;
};

const banUser = async (id, payload) => {
  const user = await User.findByIdAndUpdate(
    id,
    {
      banned: payload.banned,
      banReason: payload.banReason || null,
      banExpires: payload.banned ? payload.banExpires || null : null,
    },
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    throw new AppError(404, 'User not found!');
  }

  return user;
};

const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError(404, 'User not found!');
  }
  return user;
};

const getDashboardStats = async () => {
  const [passengers, drivers, managers, admins, totalBuses, totalRoutes] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    User.countDocuments({ role: 'driver' }),
    User.countDocuments({ role: 'transportation-manager' }),
    User.countDocuments({ role: 'admin' }),
    Bus.countDocuments(),
    RouteModel.countDocuments(),
  ]);

  return {
    accounts: {
      passengers,
      drivers,
      transportationManagers: managers,
      admins,
      totalUsers: passengers + drivers + managers + admins,
    },
    fleet: {
      totalBuses,
      totalRoutes,
    },
  };
};

export const AdminService = {
  signupAdmin,
  loginAdmin,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserRole,
  banUser,
  deleteUser,
  getDashboardStats,
};

export default AdminService;

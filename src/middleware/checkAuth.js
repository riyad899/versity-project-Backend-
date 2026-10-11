import { fromNodeHeaders } from 'better-auth/node';
import AppError from '../app/errorHelpers/appError.js';
import getAuth from '../app/lib/auth.js';
import catchAsync from '../app/shared/catchAsync.js';
import { User } from '../schema/index.js';

export const checkAuth = (...requiredRoles) => {
  return catchAsync(async (req, res, next) => {
    const auth = getAuth();
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      throw new AppError(401, 'You are not authorized! Token/Session missing or invalid.');
    }

    // Check user in database for up-to-date role and ban status
    const dbUser = await User.findOne({ email: session.user.email });
    if (dbUser && dbUser.banned) {
      throw new AppError(403, `Account is suspended: ${dbUser.banReason || 'Contact support'}`);
    }

    const role = dbUser?.role || session.user.role || 'user';

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(403, 'You do not have permission to access this resource!');
    }

    req.user = dbUser
      ? { ...session.user, ...dbUser.toObject(), id: dbUser._id.toString() }
      : session.user;
    req.session = session.session;
    next();
  });
};

export default checkAuth;

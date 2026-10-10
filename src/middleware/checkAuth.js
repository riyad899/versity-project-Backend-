import { fromNodeHeaders } from 'better-auth/node';
import AppError from '../app/errorHelpers/appError.js';
import getAuth from '../app/lib/auth.js';
import catchAsync from '../app/shared/catchAsync.js';

export const checkAuth = (...requiredRoles) => {
  return async (req, res, next) => {
  try {
    const auth = getAuth();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session || !session.user) {
      throw new AppError(
        401,
        'You are not authorized! Token/Session missing or invalid.'
      );
    }

    const role = session.user.role || 'user';

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new AppError(
        403,
        'You do not have permission to access this resource!'
      );
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (err) {
    next(err);
  }
}
};

export default checkAuth;

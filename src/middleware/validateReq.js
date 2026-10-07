import catchAsync from '../app/shared/catchAsync.js';

export const validateReq = (schema) => {
  return catchAsync(async (req, res, next) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
      cookies: req.cookies,
    });
    
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;

    next();
  });
};

export default validateReq;

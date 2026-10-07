export const sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta || undefined,
    data: data.data || null,
  });
};

export default sendResponse;

export const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'API Route Not Found!',
    errorSources: [
      {
        path: req.originalUrl,
        message: 'API Path does not exist',
      },
    ],
  });
};

export default notFound;

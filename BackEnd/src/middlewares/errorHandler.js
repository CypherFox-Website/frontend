// BackEnd\src\middlewares\errorHandler.js
export const errorHandler = (error, _req, res, _next) => {
  const statusCode = Number(error?.status) || 500;

  res.status(statusCode).json({
    error: error?.message || "Unexpected error",
    details: error?.details || null,
    hint: error?.hint || null,
    code: error?.code || null,
  });
};

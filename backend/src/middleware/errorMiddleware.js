/* eslint-disable no-unused-vars */
const errorMiddleware = (
  err,
  req,
  res,
  _next
) => {
  let statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);
  let message = err.message || "Server Error";
  let errors = err.errors || [];

  if (err.name === "ValidationError") {
    statusCode = 400;
    errors = Object.values(err.errors).map((item) => ({ field: item.path, message: item.message }));
    message = "Validation failed";
  } else if (err.code === 11000) {
    statusCode = 409;
    message = `A record with that ${Object.keys(err.keyPattern || {})[0] || "value"} already exists`;
  } else if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  if (statusCode >= 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {}),
  });
};

export default errorMiddleware;

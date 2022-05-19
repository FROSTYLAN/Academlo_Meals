const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || 'fail';

  res.status(statusCode).json({
    status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = { globalErrorHandler };

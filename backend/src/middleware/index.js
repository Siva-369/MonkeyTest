/**
 * Middleware index file
 * Centralizes all middleware exports
 */

const { verifyToken, restrictTo } = require('./auth');
const { AppError, globalErrorHandler } = require('./error');

module.exports = {
  verifyToken,
  restrictTo,
  AppError,
  globalErrorHandler
};
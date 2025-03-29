/**
 * Configuration index file
 * Centralizes all configuration exports
 */

const env = require('./env');
const connectDB = require('./database');

module.exports = {
  env,
  connectDB
};
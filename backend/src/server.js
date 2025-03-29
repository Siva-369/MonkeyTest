/**
 * Server entry point
 */
const app = require('./app');
const { env, connectDB } = require('./config');

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start server
    const PORT = env.PORT;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
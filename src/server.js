import app from './app.js';
import connectDB from './app/lib/db.js';
import envVars from './config/env.js';

let server;

async function main() {
  try {
    // Connect Database
    await connectDB();

    // Start Express Server
    server = app.listen(envVars.port, () => {
      console.log(`App running on port ${envVars.port} in ${envVars.env} mode 🚀`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

main();

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// Handle Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

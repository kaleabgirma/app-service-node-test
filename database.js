// database.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Load environment variables from .env in development
if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Load from .env file
}

const isProduction = process.env.NODE_ENV === 'production';

// Ensure all required environment variables are set
const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'DB_PASS'];
requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    console.error(`Missing required environment variable: ${varName}`);
    process.exit(1);
  }
});

// Sequelize configuration
const sequelizeConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
  logging: isProduction ? false : (msg) => console.log(`[Sequelize] ${msg}`),
};

if (isProduction) {
  sequelizeConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Allows self-signed certificates
    },
  };
}

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  sequelizeConfig
);

// Import and initialize models
const User = require('./models/User')(sequelize);
const MatchPrediction = require('./models/MatchPrediction')(sequelize);

// Define syncDatabase as an async function
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    if (!isProduction) {
      await sequelize.sync({ alter: true }); // Use alter: true only in development
      console.log('Database schema synchronized successfully.');
    }
  } catch (error) {
    if (error.name === 'SequelizeConnectionError') {
      console.error('Database connection error:', error.message);
    } else {
      console.error('Error during database synchronization:', error.message);
    }
  }
};

// Export sequelize instance, syncDatabase, and models
module.exports = { sequelize, syncDatabase, User, MatchPrediction };

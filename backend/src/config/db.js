const mongoose = require('mongoose');

// Keeps the connection logic in one place so server.js and the seed
// script can both reuse it without duplicating the mongoose setup.
async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is missing - copy .env.example to .env and fill it in.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  console.log(`MongoDB connected -> ${mongoose.connection.name}`);
}

module.exports = connectDB;

// Run with `npm run seed` after setting up .env. Safe to run more than
// once - everything here is an upsert, so it won't create duplicates.
require('dotenv').config();
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const User = require('../models/User');

const STARTER_CATEGORIES = [
  { name: 'Uncategorized', color: '#64748b', isDefault: true },
  { name: 'Food & Groceries', color: '#f59e0b' },
  { name: 'Transport', color: '#3b82f6' },
  { name: 'Housing & Utilities', color: '#8b5cf6' },
  { name: 'Entertainment', color: '#ec4899' },
  { name: 'Health', color: '#10b981' },
  { name: 'Shopping', color: '#ef4444' },
  { name: 'Education', color: '#06b6d4' },
];

async function seed() {
  await connectDB();

  for (const cat of STARTER_CATEGORIES) {
    await Category.findOneAndUpdate({ name: cat.name }, cat, { upsert: true });
  }
  console.log(`Seeded ${STARTER_CATEGORIES.length} starter categories (Uncategorized is protected).`);

  const adminEmail = 'admin@retain.app';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash('Admin123!', 10);
    await User.create({ name: 'Retain Admin', email: adminEmail, passwordHash, role: 'admin' });
    console.log(`Created demo admin -> ${adminEmail} / Admin123! (change this in a real deployment)`);
  } else {
    console.log('Demo admin already exists, skipping.');
  }

  console.log('Seeding complete.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

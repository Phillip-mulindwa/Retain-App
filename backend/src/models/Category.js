const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    // Hex colour so the frontend can render a consistent chip/badge per category.
    color: { type: String, default: '#64748b' },
    // The "Uncategorized" category seeded on first run - it absorbs any
    // expenses left behind when their real category gets deleted, and it
    // can never itself be deleted (enforced in the controller).
    isDefault: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);

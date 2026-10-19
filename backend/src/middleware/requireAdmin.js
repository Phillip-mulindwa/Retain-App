// Stacks on top of requireAuth - assumes req.user is already set.
// Keeping this as its own tiny middleware (rather than baking it into
// requireAuth) lets routes opt into admin-only protection explicitly.
function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admins only.' });
  }
  next();
}

module.exports = requireAdmin;

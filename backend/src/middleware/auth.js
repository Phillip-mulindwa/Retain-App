const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the Bearer token on the request and attaches the full user
// document (minus passwordHash, thanks to the toJSON transform) as
// req.user. Every route that touches a specific user's data sits behind
// this, so controllers never have to trust a userId from the client.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'You need to be signed in for that.' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({ message: 'That session is no longer valid.' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session - please sign in again.' });
  }
}

module.exports = requireAuth;

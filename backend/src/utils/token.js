const jwt = require('jsonwebtoken');

// 7 days feels right for a personal finance app you check often but
// don't want to be re-logging into every afternoon.
const TOKEN_TTL = '7d';

function signToken(user) {
  return jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
}

module.exports = { signToken };

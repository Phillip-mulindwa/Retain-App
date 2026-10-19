// Centralised error handler so every route can just `next(err)` instead of
// hand-rolling a try/catch response in each controller.
function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `That ${field} is already in use.` });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid id supplied.' });
  }

  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Something went wrong on the server.' });
}

function notFound(req, res) {
  res.status(404).json({ message: `No route for ${req.method} ${req.originalUrl}` });
}

module.exports = { errorHandler, notFound };

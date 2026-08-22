/**
 * 404 Not Found Middleware
 * Handles requests to undefined endpoints
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export default notFound;

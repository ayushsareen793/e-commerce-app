export const notFound = (req, res, next) => {
  const err = new Error(`Not found - ${req.originalUrl}`);
  err.statusCode = 404;
  next(err);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message || "Server error";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(", ");
  } else if (err.name === "CastError") {
    status = 400;
    message = "Invalid ID";
  } else if (err.code === 11000) {
    status = 409;
    message = "Duplicate value: " + Object.keys(err.keyValue || {}).join(", ");
  }

  if (status === 500) console.error(err);
  res.status(status).json({ message });
};

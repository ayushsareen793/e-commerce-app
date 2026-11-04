// Creates an Error carrying an HTTP status code.
const httpError = (status, message) => {
  const err = new Error(message);
  err.statusCode = status;
  return err;
};
export default httpError;

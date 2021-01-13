const sendError = (error, req, resp, next) => {
  resp.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};
module.exports = sendError;

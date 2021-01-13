const sendResponse = (statusCode, status, data, req, resp) => {
  resp.status(statusCode).json({
    status: status,
    data: [data],
  });
};
module.exports = sendResponse;

const { verifyToken } = require("../helpers/jwtAuthentication");
const fs = require("fs");
const path = require("path");
const sendErrorMessage = require("../helpers/sendError");
const AppError = require("../helpers/appError");
const { response } = require("express");
const fileName = path.join(__dirname, "..", "data", "users.json");
const users = JSON.parse(fs.readFileSync(fileName, "utf-8"));
const protectRoute = async (req, resp, next) => {
  // extract token
  if (!req.headers.authorization) {
    return sendErrorMessage(
      new AppError(401, "Unsuccessful", "Please login or signup"),
      req,
      res
    );
  }
  // if headers are there
  let jwtToken = req.headers.authorization.split(" ")[1];
  let decoded;
  try {
    decoded = await verifyToken(jwtToken, process.env.JWT_SECRET);
    console.log(decoded);
  } catch (err) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "Invalid Token"),
      req,
      res
    );
  }
  let { email: currentUser } = users.find((user) => {
    return user.email == decoded.email;
  });
  if (!currentUser) {
    return sendErrorMessage(
      new AppError(401, "Unsuccesssul", "User not registered"),
      req,
      res
    );
  }
  // check verification
  // req.currentUser = currentUser;
  resp.status("200").json({
    email: currentUser,
  });
  // give access
  // next();
};
module.exports = protectRoute;

// const { verifyToken } = require("../helpers/jwtAuthentication");

// const protectedRoute = async (req, resp, next) => {
//   console.log("Header", req.headers.authorization);
//   let decodedToken = await verifyToken(
//     req.headers.authorization.split(" ")[1],
//     process.env.JWT_SECRET
//   );
//   console.log(decodedToken);
//   next();
// };

// module.exports = protectedRoute;

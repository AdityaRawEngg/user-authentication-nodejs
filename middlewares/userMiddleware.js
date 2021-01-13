const bcrypt = require("bcryptjs");
const AppError = require("../helpers/appError");
const sendError = require("../helpers/sendError");
const sendResponse = require("../helpers/sendResponse");
const Users = require("../models/userModel");

const checkRequestBody = (req, resp, next) => {
  let validationArray;
  console.log(req.body);
  switch (req.url) {
    case "/signin":
      validationArray = ["email", "password", "cpassword"];
      break;
    case "/login":
      validationArray = ["email", "password"];
      break;
    default:
      return sendError(
        new AppError(400, "unsuccessful", " Route not found"),
        req,
        resp,
        next
      );
      break;
  }
  let result = validationArray.every((key) => {
    return req.body[key] && req.body[key].trim().length;
  });
  if (!result) {
    return sendError(
      new AppError(400, "Unsuccessful", "Not Valid Request Body"),
      req,
      resp,
      next
    );
  }
  next();
};
const isValidEmail = (req, resp, next) => {
  const validEmailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!req.body.email.match(validEmailFormat)) {
    return sendError(
      new AppError(400, "unsuccessful", "Invaild email format"),
      req,
      resp,
      next
    );
  }
  next();
};

const isEmailRegisteredSignUp = (req, resp, next) => {
  Users.find({ email: req.body.email })
    .then((data) => {
      console.log(data);
      if (data.length != 0) {
        return resp
          .status(200)
          .json({ status: "Unsuccessful", message: "Email Already registred" });
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const isEmailRegisteredLogin = (req, resp, next) => {
  Users.find({ email: req.body.email })
    .then((data) => {
      if (data.length == 0) {
        return resp
          .status(200)
          .json({ status: "Unsuccessful", message: "Email Not registred" });
      }
      req.currentUser = data[0];
      next();
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};

const checkConfirmPassword = (req, resp, next) => {
  if (req.body.password != req.body.cpassword) {
    return sendError(
      new AppError(
        400,
        "unsucessful",
        "Password and Confirm Password does not match"
      ),
      req,
      resp,
      next
    );
  }
  next();
};
const createHash = async (req, resp, next) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    next();
  } catch (error) {
    return sendError(
      new AppError(400, "unsuccessful", "Internal server Error"),
      req,
      resp,
      next
    );
  }
};

const isCorrectPassword = async (req, resp, next) => {
  if (!(await bcrypt.compare(req.body.password, req.currentUser.password))) {
    return sendError(
      new AppError(400, "Unsuccessful", "Password does not match"),
      req,
      resp,
      next
    );
  }
  next();
};

module.exports = {
  checkRequestBody,
  isValidEmail,
  isEmailRegisteredSignUp,
  isEmailRegisteredLogin,
  checkConfirmPassword,
  createHash,
  isCorrectPassword,
};
// const isEmailRegistered = (req, resp, next) => {
//   let user = users.find((user) => {
//     return user.email == req.body.email;
//   });
//   switch (req.url) {
//     case "/signin":
//       if (user) {
//         return sendError(
//           new AppError(400, "Unsuccessful", "Email already exist"),
//           req,
//           resp,
//           next
//         );
//         break;
//       }
//       next();
//       break;
//     case "/login":
//       if (!user) {
//         return sendError(
//           new AppError(400, "Unsuccessful", "Email Does not exist"),
//           req,
//           resp,
//           next
//         );
//         break;
//       }
//       req.currentUser = user;
//       next();
//       break;
//     default:
//       return sendError(
//         new AppError(400, "unsuccessful", " Route not found"),
//         req,
//         resp,
//         next
//       );
//       break;
//   }
// };

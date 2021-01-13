const express = require("express");
const { signUpUser, loginUser } = require("../controllers/userController");
const {
  checkRequestBody,
  isValidEmail,
  isEmailRegisteredSignUp,
  isEmailRegisteredLogin,
  checkConfirmPassword,
  createHash,
  isCorrectPassword,
} = require("../middlewares/userMiddleware");

const router = express.Router();

router.route("/signin").post(isEmailRegisteredSignUp, signUpUser);
router
  .route("/login")
  .post(isEmailRegisteredLogin, isCorrectPassword, loginUser);
router.route("/logout").get();
module.exports = router;

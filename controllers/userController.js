const User = require("../models/userModel");
const { generateToken } = require("../helpers/jwtAuthentication");

//New User
const signUpUser = (req, resp, next) => {
  const newUser = new User(req.body);
  newUser
    .save()
    .then((data) => {
      return resp.status(200).json({
        status: "Successful",
        message: "Successfully Registred",
      });
    })
    .catch((err) => {
      console.log(err);
      return resp.send({ message: err.message });
    });
};

const loginUser = async (req, resp, next) => {
  try {
    let jwtToken = await generateToken(
      { email: req.currentUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    resp.cookie("jwt", jwtToken);
    resp.status(200).json({
      status: "Successful",
      message: "Login Successful",
      data: [{ jwt: jwtToken }],
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = { signUpUser, loginUser };

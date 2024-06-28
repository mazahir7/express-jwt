const User = require("./../models/userModel");

const bcrypt = require("bcryptjs");
const cookie = require("cookie-session");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      token,
      userData: newUser,
      message: `${newUser.name} is successfully signed up`,
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email }).select("+password");

    const validPassword = await user.passwordChecker(password, user.password);

    if (!user || !validPassword) {
      res.status(401).json({
        status: "failed",
        message: "Incorrect email or password",
      });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({
      status: "success",
      user,
      token,
    });
  } catch (err) {
    res.status(400).json({ status: "failed", message: err });
  }
};

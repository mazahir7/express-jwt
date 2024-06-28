const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "User's name is required."],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "User's email is required."],
    trim: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Entered email is invalid."],
  },

  password: {
    type: String,
    required: [true, "Password is required."],
    trim: true,
    validate: {
      validator: function (val) {
        return validator.isStrongPassword(val, {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
          returnScore: false,
        });
      },
      message: "Password is not strong enough.",
    },
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.passwordChecker = async function (
  currPassword,
  encryptedPassword
) {
  return await bcrypt.compare(currPassword, encryptedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;

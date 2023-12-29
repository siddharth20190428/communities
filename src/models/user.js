const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      primaryKey: true,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      maxlength: 64,
      default: null,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      maxlength: 128,
      required: true,
    },
    password: {
      type: String,
      maxlength: 64,
      required: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

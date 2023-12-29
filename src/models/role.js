const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      primaryKey: true,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      maxlength: 64,
      unique: true,
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Role = mongoose.model("Role", RoleSchema);

module.exports = Role;

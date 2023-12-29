const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const MemberSchema = mongoose.Schema(
  {
    _id: {
      type: String,
      primaryKey: true,
      default: () => Snowflake.generate(),
    },
    community: {
      type: mongoose.Schema.Types.String,
      ref: "Community",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.String,
      ref: "User",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.String,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;

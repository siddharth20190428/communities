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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

const Member = mongoose.model("Member", MemberSchema);

module.exports = Member;

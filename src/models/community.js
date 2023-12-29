const { Snowflake } = require("@theinternetfolks/snowflake");
const mongoose = require("mongoose");

const CommunitySchema = mongoose.Schema(
  {
    _id: {
      type: String,
      primaryKey: true,
      default: () => Snowflake.generate(),
    },
    name: {
      type: String,
      maxlength: 128,
      required: true,
    },
    slug: {
      type: String,
      maxlength: 255,
      unique: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

const Community = mongoose.model("Community", CommunitySchema);

module.exports = Community;

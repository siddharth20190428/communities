const Community = require("../models/community");
const Member = require("../models/member");
const Role = require("../models/role");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const addMember = async (req, res) => {
  const { community, user, role } = req.body;
  const { authorization } = req.headers;

  const validCommunity = await Community.findById(community);
  if (!validCommunity)
    return res.apiError({
      param: "community",
      message: "Community not found.",
      code: "RESOURCE_NOT_FOUND",
    });

  const validUser = await User.findById(user);
  if (!validUser)
    return res.apiError({
      param: "user",
      message: "User not found.",
      code: "RESOURCE_NOT_FOUND",
    });

  const currentUser = jwt.verify(authorization, process.env.JWT_SECRET);
  if (currentUser.id !== validCommunity.owner)
    return res.apiError({
      message: "You are not authorized to perform this action.",
      code: "NOT_ALLOWED_ACCESS",
    });

  const validRole = await Role.findById(role);
  if (!validRole)
    return res.apiError({
      param: "role",
      message: "Role not found.",
      code: "RESOURCE_NOT_FOUND",
    });

  const memberAlready = await Member.findOne({ user });
  if (memberAlready)
    return res.apiError({
      message: "User is already added in the community.",
      code: "RESOURCE_EXISTS",
    });

  try {
    const newMember = await Member({ community, user, role });
    await newMember.save();

    const { updatedAt, ...member } = newMember._doc;

    res.apiSuccess(member);
  } catch (error) {
    res.apiError(error);
  }
};

const getAllMembers = async (req, res, next) => {
  try {
    const PAGE_SIZE = 10;

    const page = 1;
    const skip = (page - 1) * PAGE_SIZE;

    const results = await Role.find({}).skip(skip).limit(PAGE_SIZE).exec();
    const totalDocs = await Role.countDocuments();
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
  }
};

module.exports = { addMember, getAllMembers };

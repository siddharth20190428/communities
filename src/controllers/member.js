const Community = require("../models/community");
const Member = require("../models/member");
const Role = require("../models/role");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const addMember = async (req, res) => {
  const { community, user, role } = req.body;
  const { authorization } = req.headers;

  try {
    // checking if community exists
    const validCommunity = await Community.findById(community);
    if (!validCommunity)
      return res.apiError({
        param: "community",
        message: "Community not found.",
        code: "RESOURCE_NOT_FOUND",
      });

    // checking if user exists
    const validUser = await User.findById(user);
    if (!validUser)
      return res.apiError({
        param: "user",
        message: "User not found.",
        code: "RESOURCE_NOT_FOUND",
      });

    // checking if user is the community owner
    const currentUser = jwt.verify(authorization, process.env.JWT_SECRET);
    if (currentUser.id !== validCommunity.owner)
      return res.apiError({
        message: "You are not authorized to perform this action.",
        code: "NOT_ALLOWED_ACCESS",
      });

    // checking if role exists
    const validRole = await Role.findById(role);
    if (!validRole)
      return res.apiError({
        param: "role",
        message: "Role not found.",
        code: "RESOURCE_NOT_FOUND",
      });

    // checking if the member already exists in the community
    const memberAlready = await Member.findOne({ user, community });
    if (memberAlready)
      return res.apiError({
        message: "User is already added in the community.",
        code: "RESOURCE_EXISTS",
      });

    const newMember = await Member({ community, user, role });
    await newMember.save();

    const { updatedAt, ...member } = newMember._doc;

    res.apiSuccess(member);
  } catch (error) {
    res.apiError(error);
  }
};

const deleteMember = async (req, res) => {
  const memberId = req.params.id;
  const { authorization } = req.headers;

  try {
    // checking if the member exists
    const validMember = await Member.findById(memberId).populate(
      "role",
      "name"
    );
    if (!validMember)
      return res.apiError({
        message: "Member not found.",
        code: "RESOURCE_NOT_FOUND",
      });

    // accessing the currentuser
    const token = jwt.verify(authorization, process.env.JWT_SECRET);
    const currentUser = await Member.findOne({ user: token.id }).populate(
      "role",
      "name"
    );
    // checking if the current user is the communiy admin or community moderator
    if (
      !(
        currentUser.role.name !== "Community Admin" ||
        currentUser.role.name !== "Community Moderator"
      )
    )
      return res.apiError({
        message: "You are not authorized to perform this action.",
        code: "NOT_ALLOWED_ACCESS",
      });

    // checking if the current user is the community moderator and it is trying to remove community admin
    if (
      currentUser.role.name === "Community Moderator" &&
      validMember.role.name === "Community Admin"
    )
      return res.apiError({
        message: "You are not authorized to delete community admin",
        code: "NOT_ALLOWED_ACCESS",
      });

    await Member.deleteOne(memberId);
    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { addMember, deleteMember };

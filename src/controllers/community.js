const Community = require("../models/community");
const Member = require("../models/member");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");

const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;

    // checking if user is signedIn
    const currentUser = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!currentUser)
      return res.apiError({
        message: "You need to sign in to proceed.",
        code: "NOT_SIGNEDIN",
      });

    // creating community
    const newCommunity = await Community({
      name,
      slug: name,
      owner: currentUser.id,
    });
    await newCommunity.save();

    // searching adminRole Id for associating it to the member
    const adminRole = await Role.findOne({ name: "Community Admin" });

    // making the currentuser the Community Admin of the newCommunity
    const newMember = await Member({
      community: newCommunity._id,
      user: currentUser.id,
      role: adminRole._id,
    });
    await newMember.save();

    res.apiSuccess(newCommunity);
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

const getAllCommunities = async (req, res) => {
  try {
    // pagination variables
    const PAGE_SIZE = 10;
    const page = 1;
    const skip = (page - 1) * PAGE_SIZE;

    // fetching all communities and populating them with their owners
    const results = await Community.find({})
      .populate("owner", "name")
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // totaldocuments and pages
    const totalDocs = await Community.countDocuments();
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

const getAllCommunityMembers = async (req, res) => {
  try {
    const communityId = req.params.id;
    // pagination variables
    const PAGE_SIZE = 10;
    const page = 1;
    const skip = (page - 1) * PAGE_SIZE;

    // fetching all the members of the community and populating them with their name and role
    const results = await Member.find({ community: communityId })
      .populate("user", "name")
      .populate("role", "name")
      .select("-updatedAt")
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // totaldocuments and pages
    const totalDocs = await Community.countDocuments({
      community: communityId,
    });
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

const getAllOwnedCommunities = async (req, res) => {
  try {
    const { authorization } = req.headers;
    // accessing current user
    const currentUser = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!currentUser)
      return res.apiError({
        message: "You need to sign in to proceed.",
        code: "NOT_SIGNEDIN",
      });

    // pagination variables
    const PAGE_SIZE = 10;
    const page = 1;
    const skip = (page - 1) * PAGE_SIZE;

    // fetching all communities which are owned by current user and populating them with their owners
    const results = await Community.find({ owner: currentUser.id })
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // totaldocuments and pages
    const totalDocs = await Community.countDocuments({ owner: currentUser.id });
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getAllCommunityMembers,
  getAllOwnedCommunities,
};

const Community = require("../models/community");
const Member = require("../models/member");
const Role = require("../models/role");
const jwt = require("jsonwebtoken");

const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;

    // check if name's length is greater than 2
    if (name.length < 2)
      return res.apiError(
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        400
      );

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
    const filters = { community: communityId };

    // fetching all the members of the community and populating them with their name and role
    const results = await Member.find(filters)
      .populate("user", "name")
      .populate("role", "name")
      .select("-updatedAt")
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // totaldocuments and pages
    const totalDocs = await Member.countDocuments(filters);
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
    const filters = { owner: currentUser.id };

    // fetching all communities which are owned by current user and populating them with their owners
    const results = await Community.find(filters)
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // totaldocuments and pages
    const totalDocs = await Community.countDocuments(filters);
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

const getAllJoinedCommunities = async (req, res) => {
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
    const filters = { user: currentUser.id };

    // fetching all communityIds joined by the current user
    const communityIds = await Member.find(filters, "community")
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();
    // creating an array of communityids
    const communityIdsArray = communityIds.map((entry) => entry.community);

    // fetching all communities data with communityIds and populating them with their owners
    const communities = await Community.find({
      _id: { $in: communityIdsArray },
    }).populate("owner", "name");

    // totaldocuments and pages
    const totalDocs = await Member.countDocuments(filters);
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(communities, { total: totalDocs, pages: totalPages, page });
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
  getAllJoinedCommunities,
};

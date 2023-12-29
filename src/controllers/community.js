const Community = require("../models/community");
const jwt = require("jsonwebtoken");

const createCommunity = async (req, res) => {
  try {
    const { name } = req.body;
    const { authorization } = req.headers;

    const currentUser = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!currentUser)
      return res.apiError(
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
        401
      );

    const newCommunity = await Community({
      name,
      slug: name,
      owner: currentUser.id,
    });
    await newCommunity.save();

    res.apiSuccess(newCommunity);
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

const getAllCommunities = async (req, res) => {
  try {
    const PAGE_SIZE = 10;

    const page = 1;
    const skip = (page - 1) * PAGE_SIZE;

    const results = await Community.find({})
      .populate("owner", "name")
      .skip(skip)
      .limit(PAGE_SIZE)
      .exec();

    // results.map(commun)
    const totalDocs = await Community.countDocuments();
    const totalPages = Math.ceil(totalDocs / PAGE_SIZE);

    res.apiSuccess(results, { total: totalDocs, pages: totalPages, page });
  } catch (error) {
    res.apiError(error);
    console.log(error);
  }
};

module.exports = { createCommunity, getAllCommunities };

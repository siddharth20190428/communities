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
    // res.apiError(error);
    console.log(error);
  }
};

module.exports = { createCommunity };

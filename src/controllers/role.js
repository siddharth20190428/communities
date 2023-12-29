const Role = require("../models/role");

const createRole = async (req, res) => {
  const { name } = req.body;

  try {
    // Check for invalid input
    if (name.length < 2) {
      return res.apiError({
        param: "name",
        message: "Name should be at least 2 characters.",
        code: "INVALID_INPUT",
      });
    }

    const newRole = new Role({ name });

    // Save the Role to the database
    await newRole.save();
    res.apiSuccess(newRole);
  } catch (error) {
    res.apiError(error);
  }
};

const getAllRoles = async (req, res, next) => {
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

module.exports = { createRole, getAllRoles };

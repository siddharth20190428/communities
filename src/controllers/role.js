const Role = require("../models/role");

const createRole = async (req, res) => {
  const { name } = req.body;

  const errors = [];

  // Check for invalid input
  if (name.length < 2) {
    errors.push({
      param: "name",
      message: "Name should be at least 2 characters.",
      code: "INVALID_INPUT",
    });
  }

  if (errors.length > 0) {
    // If there are errors, send the error response
    res.apiError(errors, 400);
  } else {
    const newRole = new Role({ name });

    // Save the Role to the database
    await newRole.save();

    res.apiSuccess(newRole);
  }
};

module.exports = { createRole };

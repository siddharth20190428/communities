const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// const validateInput = (field, cond, message, code, errors) => {
//     cond && errors.push({ param: field, message, code: code });
// };

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for invalid input
    if (name.length < 2)
      return res.apiError(
        {
          param: "name",
          message: "Name should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        400
      );

    if (password.length < 2)
      return res.apiError(
        {
          param: "password",
          message: "Password should be at least 2 characters.",
          code: "INVALID_INPUT",
        },
        400
      );

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.apiError(
        {
          param: "email",
          message: "User with this email address already exists.",
          code: "RESOURCE_EXISTS",
        },
        400
      );

    const hashedPassword = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();

    // Responds with the access token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.apiSuccess(
      { id: newUser.id, name, email, created_at: newUser.createdAt },
      { access_token: token }
    );
  } catch (error) {
    res.apiError(error);
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser)
      return res.apiError(
        {
          param: "email",
          message: "Please provide a valid email address.",
          code: "INVALID_INPUT",
        },
        400
      );

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return res.apiError(
        {
          param: "password",
          message: "The credentials you provided are invalid.",
          code: "INVALID_CREDENTIALS",
        },
        400
      );

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res.apiSuccess(
      {
        id: validUser.id,
        name: validUser.name,
        email: validUser.email,
        created_at: validUser.createdAt,
      },
      { access_token: token }
    );
  } catch (error) {
    res.apiError(error);
  }
};

const getMe = async (req, res) => {
  const { authorization } = req.headers;

  try {
    const decoded = jwt.verify(authorization, process.env.JWT_SECRET);
    if (!decoded)
      return res.apiError(
        {
          message: "You need to sign in to proceed.",
          code: "NOT_SIGNEDIN",
        },
        401
      );

    const user = await User.findById(decoded.id).select("-password -updatedAt");

    res.apiSuccess(user);
  } catch (error) {
    res.apiError(error);
  }
};

module.exports = { signup, signin, getMe };

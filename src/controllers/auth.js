const User = require("../models/user");
const bcryptjs = require("bcryptjs");

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const errors = [];

        // Check for invalid input
        if (name.length < 2) {
            errors.push({
                param: "name",
                message: "Name should be at least 2 characters.",
                code: "INVALID_INPUT",
            });
        }
        if (password.length < 2) {
            errors.push({
                param: "password",
                message: "Password should be at least 2 characters.",
                code: "INVALID_INPUT",
            });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errors.push({
                param: "email",
                message: "User with this email address already exists.",
                code: "RESOURCE_EXISTS",
            });
        }

        if (errors.length > 0) {
            // If there are errors, send the error response
            res.apiError(errors, 400);
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const newUser = new User({ name, email, password: hashedPassword });

            // Save the user to the database
            await newUser.save();

            // Responds with the access token
            const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET);
            res.apiSuccess(
                { id: newUser.id, name, email, created_at: newUser.createdAt },
                token
            );
        }
    } catch (error) {
        res.apiError(error);
    }
};

module.exports = { signup };

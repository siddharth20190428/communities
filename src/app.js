const express = require("express");
const mongoose = require("./models/db");
const formatResponseMiddleware = require("./middlewares/index");
const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/role");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(formatResponseMiddleware);

app.use("/v1/auth", authRoutes);
app.use("/v1/role", roleRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

const express = require("express");
const mongoose = require("./models/db");
const formatResponseMiddleware = require("./middlewares/index");
const authRoutes = require("./routes/auth");
const roleRoutes = require("./routes/role");
const communityRoutes = require("./routes/community");
const memberRoutes = require("./routes/member");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(formatResponseMiddleware);

app.use("/v1/auth", authRoutes);
app.use("/v1/role", roleRoutes);
app.use("/v1/community", communityRoutes);
app.use("/v1/member", memberRoutes);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

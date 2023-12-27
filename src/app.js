const express = require("express");
const mongoose = require("./models/db");

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: "./config.env" });

const app = express();

app.use(express.json());

const userFunction = require("./routes/userRoutes");

app.use("/api/users", userFunction);

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Database connection successful"));

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${process.env.PORT}`);
});

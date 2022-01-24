const mongoose = require("mongoose");

const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
});

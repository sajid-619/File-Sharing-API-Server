var dotenv = require("dotenv/config");
var express = require("express");
var cors = require("cors");
var mongoose = require("mongoose");
var path = require("path");
const { rateLimiter } = require('./src/middlewares/rateLimiter');
const { job } = require('./src/middlewares/cronJob');

//Custom Modules
var UploadFile = require("./src/models/uploadFile");
var uploadAPI = require("./src/routes/uploadAPI");
var actionAPI = require("./src/routes/actionAPI");

//Connect to MongoDB Atlas
try {
  mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  var db = mongoose.connection;
  db.on("error", function (err) {
    console.log(err);
  });
  db.once("open", function (callback) {
    console.log("Connected to MongoDB");
  });
} catch (err) {
  console.log("Error : " + err);
}

//Cron Job to delete expired files and data
job.start();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(rateLimiter);

app.use("/files", uploadAPI);
app.use(
  "/files/:urlKey",
  function (req, res, next) {
    req.shortCode = req.params.urlKey;
    next();
  },
  actionAPI
);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}!`);
});

module.exports = app;
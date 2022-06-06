var express = require("express");
var router = express.Router();
var UploadFile = require("../models/uploadFile");
var path = require("path");
var fs = require("fs");

//GET method
router.get("/", async (req, res) => {
  const fileDetails = await UploadFile.findFileToBeShowed(req.shortCode);
  if (fileDetails) {
    const file = path.join(
      __dirname,
      process.env.FOLDER + fileDetails.fileName
    );
    res.download(file);

  } else {
    res.send("No File avaialble for download");
  }
});

//DELETE method
router.delete("/", async (req, res) => {
  //Deletes the data from MongoDB
  const fileDetails = await UploadFile.findFileToBeDeleted(req.shortCode);
  console.log(fileDetails);

  if (!fileDetails) {
    res.send("No file Exist");
  }

  UploadFile.findOneAndDelete(
    { privateKey: req.shortCode },
    function (err, deletedFile) {
      console.log(deletedFile);
      if (err) console.log(err);
      //Removes the file from the directory
      fs.unlinkSync(
        path.join(__dirname, process.env.FOLDER + deletedFile.fileName)
      );
      console.log("Data removed from  MongoDB, File will be deleted soon !");
      res.send("File Deleted Successfully!");
    }
  );

});

module.exports = router;

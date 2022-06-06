var express = require("express");
var router = express.Router();
var nanoid = require("nanoid").nanoid;
var UploadFile = require("../models/uploadFile");
var path = require("path");
var fs = require("fs");
var formidable = require("formidable");
var moment = require("moment");
var crypto = require('crypto');

//POST method
router.post("/", async (req, res) => {

  var prime_length = 60;
  var diffHell = crypto.createDiffieHellman(prime_length);
  diffHell.generateKeys('base64');

  let canadaTime = moment().tz("America/Toronto");
  var form = new formidable.IncomingForm();
  form.uploadDir = path.join(__dirname, process.env.FOLDER);
  form.parse(req, function (err, fields, files) {

    //Update filename
    var file_name = new Date().getTime() + '_' + files.upload.name;
    console.log(file_name);
    //Upload file on our server
    fs.rename(
      files.upload.path,
      path.join(form.uploadDir, file_name),
      function (err) {
        if (err) console.log(err);
      }
    );
    console.log("Received upload");

    //Check if URLEXPIRY field is filled in or sets a default value with 1 hour
    if (!fields.urlExpiryTime) {
      canadaTime.add(1, "hours");
    } else {
      canadaTime.add(parseInt(fields.urlExpiryTime), "hours");
    }

    var fileDetails = new UploadFile({
      fileName: file_name,
      urlShortCode: diffHell.getPublicKey('hex'),
      privateKey: diffHell.getPrivateKey('hex'),
      urlExpiry: canadaTime.format(),
    });

    //Save the file Details
    fileDetails.save(function (err) {
      if (err) console.log(err);
      let origin = req.get("host");
      res.send(
        "File Uploaded successfuly.\npublicKey : " +
        fileDetails.urlShortCode +
        "\nprivatekey : " +
        fileDetails.privateKey
      );
    });
  });
  form.on("end", function (err, fields, files) {
    console.log("File successfuly uploaded, and Data added to Mongo DB");
  });
});

module.exports = router;

var mongoose = require("mongoose");
var timeZone = require("mongoose-timezone");

//Create a schema, basically a table in sql
const uploadFileSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },
    urlShortCode: String,
    privateKey: String,
    urlExpiry: Date,
  },
  {
    timestamps: true,
    collection: "uploadFiles",
  }
);

//Function to find a document with the public key
uploadFileSchema.statics.findFileToBeShowed = async function (shortCode) {
  return await this.findOne({ urlShortCode: shortCode });
};

//Function to find a document with the private key
uploadFileSchema.statics.findFileToBeDeleted = async function (shortCode) {
  return await this.findOne({ privateKey: shortCode });
};

//Used keep the Candian timezone, mongoose uses a different timezone when saving data
uploadFileSchema.plugin(timeZone, { paths: ["date", "subDocument.subDate"] });

//Create and instantiate model with schema
const UploadFile = mongoose.model("uploadFiles", uploadFileSchema);

module.exports = UploadFile;

var CronJob = require("cron").CronJob;
var moment = require("moment");
var UploadFile = require("../models/uploadFile");
var fs = require("fs");

//Cron Job to delete expired files and data
//This Cron Job runs every Minute to delete expired files and data from MongoDB
const job = new CronJob("0 */1 * * * *", function () {
    console.log(
        "Cron Job running"
    );
    UploadFile.find({}, function (err, filesFound) {
        if (err) console.log(err);
        //Loops through each element and deletes them if expired
        filesFound.forEach((element) => {
            if (
                moment.tz(element.urlExpiry, "America/Toronto").format() <
                moment().tz("America/Toronto").format()
            ) {
                let id = element.id;
                let fileName = element.fileName;
                UploadFile.findByIdAndDelete(id, function (err, model) {
                    //Delete the file too
                    let filePath = "./public/files/" + fileName;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                    console.log("File Deleted Succefully at " + new Date());
                });
            }
        });
    });
});
module.exports = { job }
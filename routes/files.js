const express = require("express");
const router = express.Router();

const passport = require("passport");
const FileModel = require("../models/file");

const md5 = require("md5");

router.get("/", (req, res) => {
  FileModel.find({ }, (error, files) =>{
    if(error) return res.status(500).json({error: "Failed to get files"});

    return res.json(files);
  });
});

// router.use(passport.authenticate('jwt', {session: false}));

router.post("/new", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).json({error: "No file uploaded"});
  }

  let newFile = req.files.file;
  let storedName = md5(Date.now() + req.connection.remoteAddress);
  let uploadLocation = req.user === undefined ? storedName : (req.user.user_id + "/" + storedName); 

  newFile.mv("uploads/" + uploadLocation, (error) => {
    if(error) {
      return res.status(500).json({error: "Failed to upload file"});
    }

    let fileDocument = new FileModel();
    if(req.user) fileDocument.userId = req.user.user_id;
    fileDocument.filename = newFile.name;
    fileDocument.location = uploadLocation;
    fileDocument.size = newFile.size;

    fileDocument.save(error => {
      if(error) return res.status(500).json({error: "Failed to save document"});
      res.json({file: fileDocument._id});
    });

  });
});

module.exports = router;
const express = require("express");
const router = express.Router();

const passport = require("passport");
const FileModel = require("../models/file");

router.get("/", (req, res) => {
  res.send("Files index");
});

router.use(passport.authenticate('jwt', {session: false}));

router.post("/new", (req, res) => {
  if (Object.keys(req.files).length == 0) {
    return res.status(400).json({error: "No file uploaded"});
  }

  let newFile = req.files.file;
  let uploadLocation = req.user.user_id + "/" + Date.now(); 

  newFile.mv("uploads/" + uploadLocation, (error) => {
    if(error) {
      return res.status(500).json({error: "Failed to upload file"});
    }

    let fileDocument = new FileModel({
      userId: req.user.user_id,
      fileName: newFile.name,
      location: uploadLocation,
      size: newFile.size
    });

    fileDocument.save(error => {
      if(error) return res.status(500).json({error: "Failed to save document"});
      res.json({status: "Upload successfull", fileName: newFile.name});
    });

  });
});

module.exports = router;
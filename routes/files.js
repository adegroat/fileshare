const express = require("express");
const router = express.Router();
const config = require("../config");

const passport = require("passport");
const FileModel = require("../models/file");

const md5 = require("md5");
const fs = require("fs");

router.get("/", (req, res) => {
  FileModel.find({ }, [], {sort: {upload_time: -1}}, (error, files) =>{
    if(error) return res.status(500).json({error: "Failed to get files"});

    return res.json(files);
  });
});

router.get("/:id", (req, res) => {
  FileModel.findOne({_id: req.params.id}, (error, file) => {
    if(error) return res.status(500).json({error: "Could not find file"});
    
    if(req.query.dl == '1') {
      let filePath = "uploads/" + file.location;

      if(fs.existsSync(filePath)) {
        return res.download(filePath, file.filename);
      }
    }

    return res.json(file);
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

  if(newFile.size > config.MAX_UPLOAD_SIZE) {
    return res.status(400).json({
      error: {
        message: "File size too large",
        max_file_size: config.MAX_UPLOAD_SIZE
      }
    });
  }

  newFile.mv("uploads/" + uploadLocation, (error) => {
    if(error) {
      return res.status(500).json({error: "Failed to upload file"});
    }

    let fileDocument = new FileModel();
    if(req.user) fileDocument.userId = req.user.user_id;
    fileDocument.filename = newFile.name;
    fileDocument.location = uploadLocation;
    fileDocument.size = newFile.size;
    fileDocument.upload_time = Date.now();

    fileDocument.save(error => {
      if(error) return res.status(500).json({error: "Failed to save document"});
      res.json({file: fileDocument._id});
    });

  });
});

module.exports = router;
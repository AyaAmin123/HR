const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __basedir + "/data/attendance/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});

const upload_attendance = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "text/plain") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .txt format allowed!"));
    }
  },
});

module.exports = upload_attendance;

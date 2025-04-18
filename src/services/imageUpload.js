const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { join } = require("path");
const CustomError = require("../classes/CustomError");

const upload = multer({
  limits: {
    fileSize: 153600,
  },
  fileFilter: (req, file, cb) => {
    const [type, ext] = file.mimetype.split("/");
    if (type !== "image") {
      cb(new CustomError("Only images are accepted."));
      return;
    }
    cb(null, true);
  },
  storage: multer.diskStorage({
    destination: join(__dirname, "../../uploads"),
    filename: (req, file, cb) => {
      const [type, ext] = file.mimetype.split("/");
      const name = uuidv4();
      const fullName = `${name}.${ext}`;
      cb(null, fullName);
    },
  }),
});

module.exports = upload;

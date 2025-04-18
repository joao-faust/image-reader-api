const multer = require("multer");
const Tesseract = require("tesseract.js");
const { Router } = require("express");
const { unlink } = require("fs/promises");
const imageUpload = require("../services/imageUpload");
const CustomError = require("../classes/CustomError");

const router = Router();

const imageUploadMiddleware = imageUpload.single("image");

router.post("/", imageUploadMiddleware, async (req, res) => {
  const imagePath = req.file.path;
  const lang = "por+spa+eng";
  try {
    const { data } = await Tesseract.recognize(imagePath, lang);
    const { text } = data;
    await unlink(imagePath);
    res.send({ text: text.toString("utf-8") });
  } catch (error) {
    res
      .status(400)
      .send({ message: "There was an error reading the text from the image" });
  }
});

router.use((error, req, res, next) => {
  console.log(error);
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({ message: error.message });
  } else if (error instanceof multer.MulterError) {
    res.status(400).json({ message: error.message });
  } else {
    res.status(400).json({ message: "There was an unexpected error" });
  }
  next();
});

module.exports = router;

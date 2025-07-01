const multer = require("multer");

const profileStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const certStorage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}=${file.originalname}`);
  },
});

// file filter

const imageFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

const allowedMimeTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];

const docsFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(
      new Error("Only document files (PDF/DOC/DOCX) are allowed!"),
      false
    );
  }
  cb(null, true);
};

const certUpload = multer({
  storage: certStorage,
  fileFilter: docsFilter,
});
const profileUpload = multer({
  storage: profileStorage,
  fileFilter: imageFilter,
});

module.exports = {
  certUpload,
  profileUpload,
};

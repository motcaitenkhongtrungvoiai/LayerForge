const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Tạo folder nếu chưa tồn tại
const tempFolder = path.join(__dirname, "../../temp");
if (!fs.existsSync(tempFolder)) {
  fs.mkdirSync(tempFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempFolder);
  },

  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedTypes = [".psd"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("File không được hỗ trợ!"), false);
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 },
});

module.exports = upload;

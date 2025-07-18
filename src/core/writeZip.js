const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const { logger } = require("../until/writeLog");

async function zipFolder(sourceFolder, outPath,callback) {
  // Kiểm tra thư mục đầu vào
  if (!fs.existsSync(sourceFolder)) {
    logger.error(` Thư mục không tồn tại: ${sourceFolder}`);
    return;
  }

  const output = fs.createWriteStream(outPath);
  const archive = archiver("zip", {
    zlib: { level: 9 }, // nén tối đa
  });

  output.on("close", () => {
    logger.info(` Đã tạo file zip: ${outPath} (${archive.pointer()} bytes)`);
    callback()
  });

  archive.on("warning", (err) => {
    if (err.code === "ENOENT") {
      logger.warn(err.message);
    } else {
      throw err;
    }
  });

  archive.on("error", (err) => {
    logger.error(` Lỗi khi tạo zip: ${err.message}`);
    throw err;
  });

  archive.pipe(output);
  archive.directory(sourceFolder, false); // false để không lấy tên thư mục gốc
  archive.finalize();
}
module.exports = zipFolder
// Thư mục cần nén
/*
const inputFolder = path.join(__dirname, "../output/testting");

// File zip sẽ tạo ra
const outputZip = path.join(__dirname, "../output/testting.zip");

zipFolder(inputFolder, outputZip);
*/
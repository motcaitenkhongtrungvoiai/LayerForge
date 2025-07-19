const fs = require("fs");
const archiver = require("archiver");
const path = require("path");
const { logger } = require("../until/writeLog");

function zipFolder(sourceFolder, outPath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(sourceFolder)) {
      const errorMsg = `Thư mục không tồn tại: ${sourceFolder}`;
      logger.error(errorMsg);
      return reject(new Error(errorMsg));
    }

    const output = fs.createWriteStream(outPath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    // Đảm bảo không resolve trước khi output thực sự ghi xong
    output.on("close", () => {
      logger.info(`Đã tạo file zip: ${outPath} (${archive.pointer()} bytes)`);
      resolve(outPath);
    });

    output.on("end", () => {
      logger.info("Stream đã kết thúc.");
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        logger.warn(err.message);
      } else {
        reject(err);
      }
    });

    archive.on("error", (err) => {
      logger.error(`Lỗi khi tạo zip: ${err.message}`);
      reject(err);
    });

    // Bắt đầu ghi
    archive.pipe(output);

    // Gọi các bước thêm file vào archive xong mới finalize
    archive.directory(sourceFolder, false);

    // Quan trọng: phải đảm bảo gọi finalize sau khi tất cả dữ liệu đã được add
    archive.finalize().catch((err) => {
      logger.error("Lỗi khi gọi finalize:", err);
      reject(err);
    });
  });
}
module.exports= zipFolder
const path = require("path");
const fs = require("fs").promises;
const RipperPSD = require("../core/RipperPSD");
const zipFolder = require("../core/writeZip");
const { logger } = require("../until/writeLog");

const processPSD = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Không tìm thấy file PSD" });
    }

    const inputFile = req.file.path;
    const fileName = path.basename(inputFile, path.extname(inputFile));
    const outPath = path.join(__dirname, "../../jobs", fileName);
    const outZip = path.join( __dirname,  "../../download_enable/", fileName + ".zip");
    

    const ripperPSD = new RipperPSD(inputFile, outPath);
    await Promise.all([
       ripperPSD.RipperPSD(),
       ripperPSD.ParsePSD()
    ]);

     zipFolder(outPath, outZip, async () => {
       fs.rm(outPath, { recursive: true, force: true });
       fs.rm(inputFile,{ recursive: true, force: true });
    });

    res.status(200).json({
      message: "Xử lý thành công",
      zipPath: `/download/${fileName}.zip`,
    });
  } catch (err) {
    logger.error("Lỗi xử lý PSD:", err);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý file PSD" });
  }
};

module.exports = { processPSD };

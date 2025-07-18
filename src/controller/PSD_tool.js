const path = require("path");
const RipperPSD = require("../core/RipperPSD");
const zipFolder = require("../core/writeZip");
const { logger } = require("../until/writeLog");
const fs = require("fs").promises;

const inputFile = path.join(__dirname, "../core/testting.psd");
const outPath = path.join(__dirname, "../../jobs/tessting");
const outPath1 = path.join(__dirname, "../../dowload_enabale/tessting.zip");
const ripperPSD = new RipperPSD(inputFile, outPath);

(async () => {
  try {
    await Promise.all([ripperPSD.RipperPSD(), ripperPSD.ParsePSD()]);
    await zipFolder(outPath, outPath1, async () => {
      await fs.rm(outPath, { recursive: true, force: true });
    });
  } catch (err) {
    console.error("Có lỗi xảy ra:", err);
  }
})();

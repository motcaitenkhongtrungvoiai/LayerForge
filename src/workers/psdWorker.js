const { workerData, parentPort } = require("worker_threads");
const path = require("path");
const fs = require("fs").promises;
const RipperPSD = require("../core/RipperPSD");
const zipFolder = require("../core/writeZip");
const { logger } = require("../until/writeLog"); 

if (!parentPort) {
  throw new Error("Worker phải được chạy trong worker thread");
}

(async () => {
  const { inputFile, jobsFolder, downloadFolder } = workerData;
  const fileName = path.basename(inputFile, path.extname(inputFile));
  const outPath = path.join(jobsFolder, fileName);
  const outZip = path.join(downloadFolder, `${fileName}.zip`);

  const send = (payload) => {
    try {
      parentPort.postMessage(payload);
      parentPort.close();
    } catch (err) {
      console.error("Không thể gửi kết quả từ worker:", err);
    }
  };

  try {
    logger.info(`Bắt đầu xử lý file: ${inputFile}`);

    // 1. Parse và xử lý PSD
    const ripperPSD = new RipperPSD(inputFile, outPath);
    await ripperPSD.ParsePSD();
    await ripperPSD.RipperPSD();

    // 2. Nén output
    try {
      await zipFolder(outPath, outZip);
      logger.info(`Đã tạo file zip: ${outZip}`);
    } catch (zipErr) {
      logger.error(`Lỗi khi nén file PSD: ${zipErr.message}`);
      send({
        success: false,
        error: "Lỗi nén file PSD",
        detail: zipErr.message,
        code: "ZIP_ERROR"
      });
      return;
    }

    // 3. Dọn dẹp file gốc và thư mục tạm
    try {
      await Promise.allSettled([
        fs.rm(outPath, { recursive: true, force: true }),
        fs.rm(inputFile, { force: true })
      ]);
      logger.info("Đã dọn dẹp file và thư mục tạm.");
    } catch (cleanupErr) {
      logger.warn(`Lỗi khi xoá tạm: ${cleanupErr.message}`);
    }

    // 4. Trả kết quả thành công
    send({
      success: true,
      zipPath: outZip,
      fileName: fileName + ".zip"
    });
  } catch (err) {
    logger.error(`Lỗi xử lý PSD: ${err.message}`);
    send({
      success: false,
      error: "Lỗi xử lý PSD",
      detail: err.message,
      stack: err.stack,
      code: "PSD_PROCESS_ERROR"
    });
  }
})();

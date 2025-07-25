// controllers/processPSD.js
const path = require("path");
const { Worker } = require("worker_threads");

const jobsFolder = path.join(__dirname, "../../jobs");
const downloadFolder = path.join(__dirname, "../../download_enable");

// Hàm để chạy worker
async function runWorker(workerPath, inputFile, jobsFolder, downloadFolder) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(workerPath, {
      workerData: { inputFile, jobsFolder, downloadFolder },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

const processPSD = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Không tìm thấy file PSD" });
  }

  const inputFile = req.file.path;
  const workerPath = path.join(__dirname, "../workers/psdWorker.js");

  try {
    const result = await runWorker(workerPath, inputFile, jobsFolder, downloadFolder);
    if (result.success) {
      res.status(200).json({
        message: "Xử lý thành công",
        output: result.zipPath,
      });
    } else {
      res.status(500).json({ error: result.error || "Lỗi không xác định trong worker" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = processPSD;

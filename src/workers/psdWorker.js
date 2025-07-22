// workers/psdWorker.js
const { workerData, parentPort } = require('worker_threads');
const path = require("path");
const fs = require("fs").promises;
const RipperPSD = require("../core/RipperPSD");
const zipFolder = require("../core/writeZip");

(async () => {
  try {
    const { inputFile, jobsFolder, downloadFolder } = workerData;

    const fileName = path.basename(inputFile, path.extname(inputFile));
    const outPath = path.join(jobsFolder, fileName);
    const outZip = path.join(downloadFolder, fileName + ".zip");

    const ripperPSD = new RipperPSD(inputFile, outPath);
    await ripperPSD.ParsePSD();
    await ripperPSD.RipperPSD();

    await zipFolder(outPath, outZip);
    await fs.rm(outPath, { recursive: true, force: true });
    await fs.rm(inputFile, { recursive: true, force: true });

    parentPort.postMessage({ success: true, zipPath: outZip });
  } catch (err) {
    parentPort.postMessage({ success: false, error: err.message });
  }
})();

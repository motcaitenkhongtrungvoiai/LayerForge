const { workerData, parentPort } = require("worker_threads");
const fs = require("fs");
const path = require("path");

try {
  const { buffer, safeName, index, outPath } = workerData;
  const fileName = `${index + 1}_${safeName}.png`;
  const filePath = path.join(outPath, fileName);

  fs.writeFileSync(filePath, Buffer.from(buffer));
  parentPort.postMessage(` Worker đã lưu: ${fileName}`);
} catch (err) {
  parentPort.postMessage(` Worker lỗi: ${err.message}`);
  throw err;
}

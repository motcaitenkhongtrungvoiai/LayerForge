const PSD = require("psd");
const fs = require("fs");
const path = require("path");
const { logger } = require("../until/writeLog");
const { FixedThreadPool } = require("poolifier");
const dotenv = require("dotenv");
dotenv.config();

class RipperPSD {
  constructor(sourceFile, outPath) {
    this.sourceFile = sourceFile;
    this.outPath = outPath;
    this._checkPaths();
  }

  _checkPaths() {
    if (!fs.existsSync(this.sourceFile)) {
      throw new Error(` Không tìm thấy source file: ${this.sourceFile}`);
    }

    if (!fs.existsSync(this.outPath)) {
      fs.mkdirSync(this.outPath, { recursive: true });
      logger.info(` Đã tạo thư mục đầu ra: ${this.outPath}`);
    }
  }

  async bigFile() {
    const workerPath = path.join(__dirname, "../worker/ripperPSDworker.js");
    const coreCount = parseInt(process.env.NUMBER_CPU_CORE) || 4;
    const pool = new FixedThreadPool(coreCount, workerPath);

    let psd;
    try {
      psd = await PSD.open(this.sourceFile);
    } catch (err) {
      logger.error(" Lỗi khi mở PSD trong bigFile:", err);
      return;
    }

    const layers = psd
      .tree()
      .descendants()
      .filter((n) => n.type === "layer" && n.layer.image);

    logger.info(` Tìm thấy ${layers.length} layer có hình ảnh.`);

    const tasks = layers.map((layer, index) => {
      try {
        const safeName =
          layer.name?.replace(/[\/\\:*?"<>|]/g, "_") || `layer_${index}`;
        const buffer = layer.layer.image.toPng(); // Trả về Buffer
        return pool.execute({
          buffer,
          safeName,
          index,
          outPath: this.outPath,
        });
      } catch (err) {
        logger.error(` Lỗi tạo buffer layer ${index}:`, err);
        return Promise.reject(err);
      }
    });

    const results = await Promise.allSettled(tasks);
    results.forEach((result, i) => {
      if (result.status === "rejected") {
        logger.error(` Task ${i} thất bại:`, result.reason);
      } else {
        logger.info(`Task ${i} hoàn tất.`);
      }
    });

    pool.destroy();
    psd = null;
  }

  async smallerFile() {
    let psd;
    try {
      psd = await PSD.open(this.sourceFile);
    } catch (err) {
      logger.error(" Lỗi khi mở PSD trong smallerFile:", err);
      return;
    }

    const layers = psd
      .tree()
      .descendants()
      .filter((n) => n.type === "layer" && n.layer.image);

    logger.info(`Tìm thấy ${layers.length} layer có hình ảnh.`);

    for (let i = 0; i < layers.length; i++) {
      const node = layers[i];
      const safeName =
        node.name?.replace(/[\/\\:*?"<>|]/g, "_") || `layer_${i}`;
      const layerPath = path.join(this.outPath, `${i + 1}_${safeName}.png`);

      try {
        await node.layer.image.saveAsPng(layerPath);
        logger.info(` Đã lưu layer: ${layerPath}`);
      } catch (err) {
        logger.error(` Lỗi khi xuất layer ${safeName}:`, err);
      }
    }

    psd = null;
  }
}

module.exports = RipperPSD;

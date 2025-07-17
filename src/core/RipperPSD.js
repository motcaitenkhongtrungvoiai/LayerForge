const PSD = require("psd");
const fs = require("fs");
const path = require("path");
const { logger } = require("../until/writeLog");
const { injectId } = require("../until/injectID");
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
      logger.error(`file PSD not found`);
      throw new Error(` Không tìm thấy source file: ${this.sourceFile}`);
    }

    if (!fs.existsSync(this.outPath)) {
      fs.mkdirSync(this.outPath, { recursive: true });
      logger.info(` Đã tạo thư mục đầu ra: ${this.outPath}`);
    }
  }
  // những file < 50MB
  async RipperPSD() {
    let psd;
    try {
      psd = await PSD.open(this.sourceFile);
    } catch (err) {
      logger.error(" Lỗi khi mở PSD trong smallerFile:", err);
      return;
    }

    let layers = psd
      .tree()
      .descendants()
      .filter((n) => n.type === "layer" && n.layer.image);

    logger.info(`Tìm thấy ${layers.length} layer có hình ảnh.`);

    for (let i = 0; i < layers.length; i++) {
      let node = layers[i];
      let safeName = node.name?.replace(/[\/\\:*?"<>|]/g, "_") || `layer_${i}`;
      let layerPath = path.join(this.outPath, `${i + 1}_${safeName}.png`);
      try {
        await node.layer.image.saveAsPng(layerPath);
        logger.info(` Đã lưu layer: ${layerPath}`);
        //giải phóng bộ nhớ.
        layers[i] = null;
      } catch (err) {
        logger.error(` Lỗi khi xuất layer ${safeName}:`, err);
      }
    }
    psd = null;
  }
 async ParsePSD() {
  const outputJsonPath = path.join(this.outPath, "a-meta.json");
  try {
    const psd = await PSD.open(this.sourceFile);
    const exportedTree = psd.tree().export();
    injectId(exportedTree);  
    await fs.promises.writeFile(outputJsonPath, JSON.stringify(exportedTree, null, 2), "utf-8");
    logger.info("Parse file thành công");
  } catch (err) {
    logger.error("Lỗi trong quá trình parse PSD:", err);
  }
}

}

module.exports = RipperPSD;

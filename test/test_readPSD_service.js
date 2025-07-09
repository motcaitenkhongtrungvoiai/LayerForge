const PSD = require("psd");
const path = require("path");
const fs = require("fs");

const FilePSdPath = "testting.psd";
const psdPath = path.join(__dirname, FilePSdPath);

// Tạo base name cho folder
const fileNameWithoutExt = path.basename(psdPath, path.extname(psdPath));
const outputDir = path.join(__dirname, "output", fileNameWithoutExt);
const outputJsonPath = path.join(outputDir, "a-meta.json");

fs.mkdir(outputDir, { recursive: true }, (err) => {
  if (err) {
    console.error("Lỗi khi tạo thư mục:", err);
    return;
  }

  console.log("Thư mục được tạo thành công!");

  PSD.open(psdPath)
    .then((psd) => {
      // Đánh ID duy nhất cho từng layer
      let layerIdCounter = 0;

      function injectId(node) {
        if (node.type === "layer") {
          node.id = "layer_" + (layerIdCounter++);
        }

        if (Array.isArray(node.children)) {
          node.children.forEach(child => injectId(child));
        }
      }

      const exportedTree = psd.tree().export();
      injectId(exportedTree);

      // Ghi file JSON meta ra output
      fs.writeFileSync(outputJsonPath, JSON.stringify(exportedTree, null, 2), "utf-8");
      console.log("✔ Đã xuất file meta thành công!");

      // Trích xuất PNG các layer và đặt tên file theo id + name
      const descendants = psd.tree().descendants().filter(n => n.type === "layer");

      descendants.forEach((node) => {
        const id = "layer_" + descendants.indexOf(node);
       
        const layerPath = path.join(outputDir, `${id}.png`);

        if (node.layer && node.layer.image) {
          node.layer.image.saveAsPng(layerPath)
            .then(() => {
              console.log(`✔ Đã xuất layer ${node.name} thành PNG`);
            })
            .catch(err => {
              console.error(`❌ Lỗi khi xuất layer ${node.name}:`, err);
            });
        }
      });

    })
    .catch((err) => {
      console.error("Lỗi khi đọc file PSD:", err);
    });
});

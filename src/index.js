const express = require("express");
const app = express();
const path = require("path");
const ripperRoutes = require("./router/ripperPSDrouter");

app.use(express.json());

// Trả file zip ra cho frontend tải về
app.use("/download", express.static(path.join(__dirname, "download_enable")));

// Routes
app.use("/api/psd", ripperRoutes);

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});

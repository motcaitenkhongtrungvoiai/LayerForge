const router = require("express").Router();
const upload = require("../middleware/uploadPSD");
const { processPSD } = require('../controller/PSD_tool')
const verification = require("../middleware/verification");


//router.post("/upload", verification.verification_API_KEY, upload.single("psdFile"), processPSD);

// Nếu không cần xác thực:
 router.post("/upload", upload.single("psdFile"), processPSD);

module.exports = router;
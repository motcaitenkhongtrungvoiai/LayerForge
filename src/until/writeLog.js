const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(logDir, "error.jsonl"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "combined.jsonl"),
    }),
  ],
 
});
module.exports= {logger}
//logger.info("Thông báo bình thường");
//logger.warn("Cảnh báo!");
//logger.error("Lỗi nghiêm trọng!");

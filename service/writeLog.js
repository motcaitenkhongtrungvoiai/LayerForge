const winston = require("winston");

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}:${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "./logs/error.log",
      level: "error",
    }),
    new winston.transports.File({ filename: "./logs/combied.log" }),
  ],
});

/*
logger.info("Thông báo bình thường");
logger.warn("Cảnh báo!");
logger.error("Lỗi nghiêm trọng!");
*/

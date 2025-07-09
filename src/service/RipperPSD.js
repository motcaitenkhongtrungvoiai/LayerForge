const PSD = require("psd");
const fs = require("fs");
const { logger } = require("../until/writeLog");

const RipperPSD = {
  bigFile: (req, res) => {},
  smallerFile: (pathToFile) => {
    const psd_file = req.file;
  },
};

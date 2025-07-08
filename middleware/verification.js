const dotenv = require("dotenv");
dotenv.config();

const middlewareController = {
  verification_API_KEY: (req, res, next) => {
    const clientKey = req.header("x-api-key");
    if (clientKey === process.env.API_KEY) {
      return next();
    }
     else res.status(401).json({ messenger: "wrong api key" });
  },
};

module.exports = middlewareController;

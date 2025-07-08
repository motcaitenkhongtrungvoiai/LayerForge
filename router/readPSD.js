
const router = require ('express').Router();
const verification= require('../middleware/verification')


router.get("/takeFile",verification.verification_API_KEY);

module.exports = router;
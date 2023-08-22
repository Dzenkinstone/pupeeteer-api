const express = require("express");

const { getPageInformation } = require("../../controllers/getPageInformation");

const router = express.Router();

router.get("/", getPageInformation);

module.exports = router;

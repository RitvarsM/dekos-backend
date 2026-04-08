const express = require("express");
const { sendOfferMessage } = require("./offer.controller");

const router = express.Router();

router.post("/", sendOfferMessage);

module.exports = router;
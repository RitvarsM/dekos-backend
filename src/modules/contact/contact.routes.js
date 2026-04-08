const express = require("express");
const { sendContactMessage } = require("./contact.controller");

const router = express.Router();

router.post("/", sendContactMessage);

module.exports = router;
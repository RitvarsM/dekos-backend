const router = require("express").Router();
const { login, logout, me } = require("./auth.controller");
const { requireAdmin } = require("../../middlewares/authMiddleware");

router.post("/login", login);
router.post("/logout", logout);
router.get("/me", requireAdmin, me);

module.exports = router;
const router = require("express").Router();
const controller = require("./blog.controller");
const { requireAdmin } = require("../../middlewares/authMiddleware");
const upload = require("../../middlewares/uploadMiddleware");

// ADMIN
router.post("/upload", requireAdmin, (req, res) => {
  upload.single("image")(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        message: err.message || "Upload kļūda",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "Fails nav augšuplādēts",
      });
    }

    const baseUrl =
      process.env.PUBLIC_BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    return res.status(200).json({
      ok: true,
      imageUrl: `${baseUrl}/uploads/${req.file.filename}`,
    });
  });
});

router.get("/all", requireAdmin, controller.getAllAdmin);
router.post("/", requireAdmin, controller.create);
router.put("/:id", requireAdmin, controller.update);
router.delete("/:id", requireAdmin, controller.remove);

// PUBLIC
router.get("/", controller.getAll);
router.get("/:slug", controller.getOne);

module.exports = router;

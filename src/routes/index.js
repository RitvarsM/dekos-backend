const router = require("express").Router();
const prisma = require("../config/prisma");

const authRoutes = require("../modules/auth/auth.routes");
const blogRoutes = require("../modules/blog/blog.routes");
const offerRoutes = require("../modules/offer/offer.routes");

router.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      ok: true,
      message: "DEKOS API darbojas",
      database: "savienota"
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Datubāzes savienojuma kļūda",
      error: error.message
    });
  }
});

router.use("/admin", authRoutes);
router.use("/blog", blogRoutes);
router.use("/offer", offerRoutes);

module.exports = router;
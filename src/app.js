const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.routes");
const blogRoutes = require("./modules/blog/blog.routes");
const offerRoutes = require("./modules/offer/offer.routes");
const contactRoutes = require("./modules/contact/contact.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500",
      "http://127.0.0.1:3000",
      "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/contact", contactRoutes);

module.exports = app;
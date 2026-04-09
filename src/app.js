const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./modules/auth/auth.routes");
const blogRoutes = require("./modules/blog/blog.routes");
const offerRoutes = require("./modules/offer/offer.routes");
const contactRoutes = require("./modules/contact/contact.routes");

const app = express();

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS nav atļauts šim origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ROOT ROUTE
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "DEKOS backend darbojas",
  });
});

// HEALTH ROUTE
app.get("/api/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/contact", contactRoutes);

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Servera kļūda:", err);
  res.status(500).json({
    ok: false,
    message: "Iekšēja servera kļūda",
  });
});

module.exports = app;
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-me";

function requireAdmin(req, res, next) {
  try {
    const cookieToken = req.cookies?.token;
    const authHeader = req.headers.authorization;

    let bearerToken = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      bearerToken = authHeader.split(" ")[1];
    }

    const token = cookieToken || bearerToken;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: "Nav autorizācijas",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: "Nederīgs vai beidzies tokens",
    });
  }
}

module.exports = {
  requireAdmin,
};
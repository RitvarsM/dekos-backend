const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../../config/prisma");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-change-me";

async function loginAdmin(email, password) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new Error("Nepareizs e-pasts vai parole");
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash);

  if (!isValid) {
    throw new Error("Nepareizs e-pasts vai parole");
  }

  const token = jwt.sign(
    {
      adminId: admin.id,
      email: admin.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    admin: {
      id: admin.id,
      email: admin.email,
    },
  };
}

module.exports = {
  loginAdmin,
};
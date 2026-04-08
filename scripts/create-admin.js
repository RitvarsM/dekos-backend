const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");

async function main() {
  const email = "ritvarsmm@gmail.com";
  const plainPassword = "audia4b6";

  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admins ar šo e-pastu jau eksistē.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      email,
      passwordHash,
    },
  });

  console.log("Admins izveidots:");
  console.log({
    id: admin.id,
    email: admin.email,
  });
}

main()
  .catch((error) => {
    console.error("Kļūda veidojot adminu:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
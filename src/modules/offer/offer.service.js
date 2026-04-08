const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendOfferEmail(data) {
  const {
    name,
    phone,
    objectType,
    services = [],
    message,
  } = data;

  const servicesText = Array.isArray(services) ? services.join(", ") : services;

  await transporter.sendMail({
    from: `"DEKOS forma" <${process.env.MAIL_USER}>`,
    to: process.env.MAIL_TO,
    subject: "Jauns pieprasījums no DEKOS mājaslapas",
    html: `
      <h2>Jauns piedāvājuma pieprasījums</h2>
      <p><strong>Vārds:</strong> ${name || "-"}</p>
      <p><strong>Telefons:</strong> ${phone || "-"}</p>
      <p><strong>Objekta veids:</strong> ${objectType || "-"}</p>
      <p><strong>Pakalpojumi:</strong> ${servicesText || "-"}</p>
      <p><strong>Papildus info:</strong></p>
      <p>${message || "-"}</p>
    `,
  });
}

module.exports = {
  sendOfferEmail,
};
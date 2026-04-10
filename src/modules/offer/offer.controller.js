const nodemailer = require("nodemailer");

function getTransporter() {
  const host = process.env.EMAIL_HOST;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!host || !port || !user || !pass) {
    throw new Error("Trūkst EMAIL konfigurācijas mainīgie.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

exports.sendOfferMessage = async (req, res) => {
  try {
    const { name, phone, objectType, services, message } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Telefona numurs ir obligāts.",
      });
    }

    console.log("JAUNS OFFER:", {
      name,
      phone,
      objectType,
      services,
      message,
    });

    const transporter = getTransporter();

    await transporter.verify();
    console.log("SMTP verify OK (offer).");

    const servicesHtml =
      Array.isArray(services) && services.length
        ? `<ul>${services.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "<p>Nav norādīts</p>";

    const adminHtml = `
      <h2>Jauns piedāvājuma pieprasījums</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name || "-")}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Objekta veids:</strong> ${escapeHtml(objectType || "-")}</p>
      <p><strong>Nepieciešamie darbi:</strong></p>
      ${servicesHtml}
      <p><strong>Papildus info:</strong></p>
      <p>${escapeHtml(message || "-").replace(/\n/g, "<br>")}</p>
    `;

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const receiverAddress = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const result = await transporter.sendMail({
      from: fromAddress,
      to: receiverAddress,
      subject: "Jauns piedāvājuma pieprasījums | DEKOS",
      html: adminHtml,
    });

    console.log("Offer email nosūtīts:", result.messageId);

    return res.status(200).json({
      message: "Pieteikums veiksmīgi nosūtīts.",
    });
  } catch (error) {
    console.error("Kļūda sūtot piedāvājuma formu:", error);
    return res.status(500).json({
      message: error.message || "Servera kļūda. Pieteikumu neizdevās nosūtīt.",
    });
  }
};
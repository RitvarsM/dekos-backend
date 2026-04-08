const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: "Jauns piedāvājuma pieprasījums | DEKOS",
      html: adminHtml,
    });

    return res.status(200).json({
      message: "Pieteikums veiksmīgi nosūtīts.",
    });
  } catch (error) {
    console.error("Kļūda sūtot piedāvājuma formu:", error);
    return res.status(500).json({
      message: "Servera kļūda. Pieteikumu neizdevās nosūtīt.",
    });
  }
};
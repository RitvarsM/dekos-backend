const nodemailer = require("nodemailer");

function createTransporter() {
  const host = process.env.EMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = (process.env.EMAIL_PASS || "").replace(/\s+/g, "");

  if (!user || !pass) {
    throw new Error("Trūkst EMAIL_USER vai EMAIL_PASS.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: false, // portam 587 jābūt false
    auth: {
      user,
      pass,
    },
    family: 4, // piespiež IPv4, lai neiet uz IPv6
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
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

    const transporter = createTransporter();

    await transporter.verify();
    console.log("SMTP verify OK");

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const receiverAddress =
      process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const servicesHtml =
      Array.isArray(services) && services.length
        ? `<ul>${services.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : "<p>Nav izvēlēts neviens pakalpojums.</p>";

    const html = `
      <h2>Jauns piedāvājuma pieprasījums</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name || "-")}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>Objekta veids:</strong> ${escapeHtml(objectType || "-")}</p>
      <p><strong>Pakalpojumi:</strong></p>
      ${servicesHtml}
      <p><strong>Papildus info:</strong></p>
      <p>${escapeHtml(message || "-").replace(/\n/g, "<br>")}</p>
    `;

    const info = await transporter.sendMail({
      from: `"DEKOS" <${fromAddress}>`,
      to: receiverAddress,
      subject: "Jauns piedāvājuma pieprasījums | DEKOS",
      html,
      replyTo: fromAddress,
    });

    console.log("Nosūtīts:", info.messageId);

    return res.status(200).json({
      message: "Pieteikums veiksmīgi nosūtīts.",
    });
  } catch (error) {
    console.error("Offer form error:", error);

    return res.status(500).json({
      message: error.message || "Neizdevās nosūtīt pieteikumu.",
    });
  }
};
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
    secure: false,
    auth: {
      user,
      pass,
    },
    family: 4,
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

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({
        message: "Lūdzu aizpildi visus laukus.",
      });
    }

    const transporter = createTransporter();

    await transporter.verify();
    console.log("SMTP verify OK");

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const receiverAddress =
      process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const adminHtml = `
      <h2>Jauna ziņa no kontaktformas</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>
      <p><strong>Tēma:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Ziņa:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    await transporter.sendMail({
      from: `"DEKOS" <${fromAddress}>`,
      to: receiverAddress,
      subject: `Jauna kontaktformas ziņa: ${subject}`,
      html: adminHtml,
      replyTo: email,
    });

    return res.status(200).json({
      message: "Ziņa veiksmīgi nosūtīta.",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      message: error.message || "Neizdevās nosūtīt ziņu.",
    });
  }
};
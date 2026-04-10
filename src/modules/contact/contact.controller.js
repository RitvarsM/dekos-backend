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

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({
        message: "Lūdzu aizpildi visus laukus.",
      });
    }

    const transporter = getTransporter();

    await transporter.verify();
    console.log("SMTP verify OK (contact).");

    const adminHtml = `
      <h2>Jauna ziņa no DEKOS kontaktformas</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>
      <p><strong>Tēma:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Ziņa:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    const fromAddress = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const receiverAddress = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;

    const adminResult = await transporter.sendMail({
      from: fromAddress,
      to: receiverAddress,
      subject: `Jauna kontaktformas ziņa: ${subject}`,
      html: adminHtml,
      replyTo: email,
    });

    console.log("Admin email nosūtīts:", adminResult.messageId);

    const customerResult = await transporter.sendMail({
      from: fromAddress,
      to: email,
      subject: "Esam saņēmuši jūsu ziņu | DEKOS",
      html: `
        <p>Sveiki, ${escapeHtml(name)}!</p>
        <p>Paldies par jūsu ziņu. Esam to saņēmuši un drīzumā ar jums sazināsimies.</p>
        <p>Ar cieņu,<br>DEKOS</p>
      `,
    });

    console.log("Customer email nosūtīts:", customerResult.messageId);

    return res.status(200).json({
      message: "Ziņa veiksmīgi nosūtīta.",
    });
  } catch (error) {
    console.error("Kļūda sūtot kontaktformas ziņu:", error);
    return res.status(500).json({
      message: error.message || "Servera kļūda. Ziņu neizdevās nosūtīt.",
    });
  }
};
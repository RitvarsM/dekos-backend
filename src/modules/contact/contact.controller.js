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

exports.sendContactMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({
        message: "Lūdzu aizpildi visus laukus.",
      });
    }

    const adminHtml = `
      <h2>Jauna ziņa no DEKOS kontaktformas</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>
      <p><strong>Tēma:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Ziņa:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: process.env.RECEIVER_EMAIL,
      subject: `Jauna kontaktformas ziņa: ${subject}`,
      html: adminHtml,
      replyTo: email,
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: "Esam saņēmuši jūsu ziņu | DEKOS",
      html: `
        <p>Sveiki, ${escapeHtml(name)}!</p>
        <p>Paldies par jūsu ziņu. Esam to saņēmuši un drīzumā ar jums sazināsimies.</p>
        <p>Ar cieņu,<br>DEKOS</p>
      `,
    });

    return res.status(200).json({
      message: "Ziņa veiksmīgi nosūtīta.",
    });
  } catch (error) {
    console.error("Kļūda sūtot kontaktformas ziņu:", error);
    return res.status(500).json({
      message: "Servera kļūda. Ziņu neizdevās nosūtīt.",
    });
  }
};
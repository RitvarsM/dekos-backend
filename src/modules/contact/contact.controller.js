const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const receiverAddress =
      process.env.RECEIVER_EMAIL || "tavs@gmail.com";

    const adminHtml = `
      <h2>Jauna ziņa no kontaktformas</h2>
      <p><strong>Vārds:</strong> ${escapeHtml(name)}</p>
      <p><strong>Telefons:</strong> ${escapeHtml(phone)}</p>
      <p><strong>E-pasts:</strong> ${escapeHtml(email)}</p>
      <p><strong>Tēma:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Ziņa:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
    `;

    await resend.emails.send({
      from: "DEKOS <onboarding@resend.dev>",
      to: receiverAddress,
      subject: `Jauna kontaktformas ziņa: ${subject}`,
      html: adminHtml,
      reply_to: email,
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
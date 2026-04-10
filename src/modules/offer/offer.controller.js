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

exports.sendOfferMessage = async (req, res) => {
  try {
    const { name, phone, objectType, services, message } = req.body;

    if (!phone) {
      return res.status(400).json({
        message: "Telefona numurs ir obligāts.",
      });
    }

    const receiverAddress =
      process.env.RECEIVER_EMAIL || "tavs@gmail.com";

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

    await resend.emails.send({
      from: "DEKOS <onboarding@resend.dev>",
      to: receiverAddress,
      subject: "Jauns piedāvājuma pieprasījums | DEKOS",
      html,
    });

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
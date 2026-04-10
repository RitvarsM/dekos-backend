exports.sendContactMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message } = req.body;

    if (!name || !phone || !email || !subject || !message) {
      return res.status(400).json({
        message: "Lūdzu aizpildi visus laukus.",
      });
    }

    console.log("JAUNA KONTAKTFORMA:");
    console.log({ name, phone, email, subject, message });

    return res.status(200).json({
      message: "Ziņa veiksmīgi nosūtīta (TEST REŽĪMS).",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Servera kļūda.",
    });
  }
};
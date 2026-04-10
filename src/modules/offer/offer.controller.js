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

    return res.status(200).json({
      message: "Pieteikums veiksmīgi saņemts (bez e-pasta testa režīms).",
    });
  } catch (error) {
    console.error("Offer error:", error);
    return res.status(500).json({
      message: "Servera kļūda.",
    });
  }
};
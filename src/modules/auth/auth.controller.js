const { loginAdmin } = require("./auth.service");

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        ok: false,
        message: "E-pasts un parole ir obligāti",
      });
    }

    const result = await loginAdmin(email, password);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      ok: true,
      message: "Ielogošanās veiksmīga",
      token: result.token,
      admin: result.admin,
    });
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: error.message,
    });
  }
}

function logout(req, res) {
  const isProduction = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
  });

  return res.json({
    ok: true,
    message: "Izlogots",
  });
}

function me(req, res) {
  return res.json({
    ok: true,
    admin: req.admin,
  });
}

module.exports = {
  login,
  logout,
  me,
};

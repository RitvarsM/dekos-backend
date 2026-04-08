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

    res.cookie("token", result.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
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
  res.clearCookie("token");
  return res.json({
    ok: true,
    message: "Izlogots",
  });
}

module.exports = {
  login,
  logout,
};

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
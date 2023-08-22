const verifyToken = async (req, res, next) => {
  const appCheckToken = req.header("X-Firebase-AppCheck");

  if (!appCheckToken) {
    return res.status(401).json({ msg: "Sem permissão para acessar esse endpoint." });
  }

  try {
    const appCheckClaims = await getAppCheck().verifyToken(appCheckToken);
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Sem permissão para acessar esse endpoint." });
  }
};

module.exports = {
  verifyToken,
};

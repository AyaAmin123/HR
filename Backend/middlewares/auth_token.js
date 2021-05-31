const jwt = require("jsonwebtoken");
let passedUrl = {
  "/auth/register": true,
  "/auth/login": true,
};
async function auth_token(req, res, next) {
  if (passedUrl[req.url.split("?")[0]]) {
    next();
  } else {
    const token = req.header("token");
    if (!token)
      return res
        .status(401)
        .send({ valid: false, msg: "Access denied .No Token Provided." });
    try {
      const decoded = await jwt.verify(token, "jwtsectertkey");
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send({ valid: false, msg: "Invalid Token" });
    }
  }
}

module.exports = auth_token;

const logger = require("../startup/logger");

async function log_req(req, res, next) {
  obj = { request: req.query, headers: req.headers, endpoint: req.url };
  // logger.debug(obj);
  next();
}

module.exports = log_req;

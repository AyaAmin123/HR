const logger = require("../startup/logger");

async function log_res(req, res, next) {
  exclued_response_log = ["/"];
  console.log("request ---------- ", req.url);
  // if res.url ==
  // var send = res.send
  // res.send = function log_response(data) {

  //     obj = { "response": data, "endpoint": req.url }
  //     typeof data === 'string' && (logger.debug(obj));

  //     send.call(this, data)
  // }

  next();
}

module.exports = log_res;

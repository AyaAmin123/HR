const express = require("express");
const app = express();
const path = require("path");
require("express-async-errors");
require("./services/QueuingServices/fingerPrintJob");
//logger
// const logger = require("./startup/logger");
var morgan = require("morgan");
// app.use(morgan("combined", { stream: logger.write }));
var uuid = require("node-uuid");
var httpContext = require("express-http-context");
global.__basedir = __dirname;
app.use(httpContext.middleware);
app.use(function (req, res, next) {
  httpContext.set("reqId", uuid.v4());
  next();
});
app.use(express.static("./public"));
const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];
require("./startup/routes")(app);
let port = 3001;
if (process.env.NODE_ENV === "development") port = 3001;
else if (process.env.NODE_ENV === "test") port = 6060;
else if (process.env.NODE_ENV === "production") port = 6060;
app.listen(
  port,
  () => console.log(`server is listening on port ${port}`)
  // logger.log("debug", `server is listening on port ${port}`)
);

"use strict";

var winston = require("winston");
var process = require("process");
const { parse, stringify } = require("flatted");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;

var httpContext = require("express-http-context");
require("express-async-errors");

process.on("unhandledRejection", (ex) => {
  throw ex;
});

// function myFormat(info) {
//     var reqId = httpContext.get('reqId');
//     info.request_id = reqId;
//     // var response = stringify(info);
//     // var response = parse(info);

//     var response = JSON.stringify(info);

//     return printf(response);

// }

const myFormat = printf((info) => {
  var reqId = httpContext.get("reqId");
  info.request_id = reqId;
  // var response = stringify(info);
  // var response = parse(info);

  var response = JSON.stringify(info);
  // var response = console.log(info);

  return response;
});

// var getNamespace = require('continuation-local-storage').getNamespace;

var winstonLogger = createLogger({
  transports: [
    new winston.transports.File({
      level: "debug",
      filename: "./logs/all-logs.log",
      handleExceptions: true,
      json: true,
      // maxsize: 5242880, // 5MB
      // maxFiles: 5,
      colorize: false,
      timestamp: true,
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    }),
    new winston.transports.Console({
      level: "debug",
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true,
      format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    }),
  ],
  exitOnError: false,
});

winstonLogger.stream = {
  write: function (message) {
    console.log("morgan ->>>>>>>>>>>>>>>>>>>>>>>>", message);

    winstonLogger.log(message);
  },
};

winstonLogger.exceptions.handle(
  new winston.transports.File({
    filename: "uncaughtExceptions.log",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
    // maxsize: 500
  }),
  new winston.transports.Console({
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
  })
);

var logger = {
  log: function (level, message) {
    winstonLogger.log(level, message);
  },
  error: function (message) {
    winstonLogger.error(message);
  },
  warn: function (message) {
    winstonLogger.warn(message);
  },
  verbose: function (message) {
    winstonLogger.verbose(message);
  },
  info: function (message) {
    winstonLogger.info(message);
  },
  debug: function (message) {
    winstonLogger.debug(message);
  },
  silly: function (message) {
    winstonLogger.silly(message);
  },
};

module.exports = logger;

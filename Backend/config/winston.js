

// const { createLogger, format, transports, config } = require('winston');
// const userLogger = createLogger({
//     levels: config.syslog.levels,
//     transports: [
//         new transports.Console(),
//         new transports.File({ filename: './logs/combined.log' })
//     ]
// });
// module.exports = userLogger;

///////////////////////////////////////////////
require('express-async-errors');
var appRoot = require('app-root-path');
var winston = require('winston');
// define the custom settings for each transport (file, console)
var options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        json: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: true,
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};
// instantiate a new Winston Logger with the settings defined above
var logger = new winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});



// create a stream object with a 'write' function that will be used by `morgan`
logger.stream = {
    write: function (message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};
module.exports = logger;
////////////////////////////////////////////////
// const winston = require('winston');
// // creates a new Winston Logger
// const logger = new winston.createLogger({
//     level: 'info',
//     // transports: [
//     //     new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
//     // ],
//     transports: [
//         new (winston.transports.Console)({
//             timestamp: function () {
//                 return Date.now();
//             },
//             formatter: function (options) {
//                 return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (options.message ? options.message : '') +
//                     (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
//             }
//         })
//     ],
//     exitOnError: false
// });
// module.exports = logger;



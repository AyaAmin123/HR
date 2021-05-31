// module.exports = function async_middleware(handler) {
//     return async (req, res, next) => {
//         try {
//             await handler(req, res);
//         } catch (ex) {
//             next(ex);
//         }
//     }

// } 
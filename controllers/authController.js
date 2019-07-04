// const config = require('../config');

// const jwt = require('jsonwebtoken');

// const User = require('../models/user');

// const getToken = (req, res) => {
//     URLSearchParams.findOne({name: req.body.name}, (err, user) => {
//         if(err) {
//             response(err, null, res);
//         }
//         if(!user){
//             response(errorHandler.INVALID_USERNAME, null, res);
//             return;
//         }
//         // first param: value returned by user every request, second: salt, third: expireTime 
//         var token = jwt.sign({userId: User._id}, config.jwtSalt, {
//             expiresIn: 60*60*24});
//         res.json({status: -1, token: token})
//         response(null, token, res);
//     })
// }

// const checkToken = (req, res, next) => {
//     let token = req.headers['x-access-token'];
//     if(token) {
//         jwt.verify(token, config.jwtSalt, (err, decoded) => {
//             if(err){
//                 Response(errorHandler.INVALID_ACCESS_TOKEN, null, res);
//                 return;
//             }
//             else {
//                 req.decoded = decoded;
//                 next();
//             }
//         });
//     }
//     else {
//         Response(errorHandler.PERMISSION_DENIED, null, res);
//         return;
//     }
// }

// module.exports = {
//     getToken,
//     checkToken
// }
const _ = require('lodash');
var {User} = require('./../models/user');


var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    try {
        User.findByToken(token).then((user) => {
            if(!user || Object.values(user).length === 0) {
                console.log(token);
                return res.status(401).send();
            }

            req.user  = user;
            req.token = token;
            next();
        });
    } catch(e) {
        res.status(401).send(); // maybe it is an invalid signature
    }
};

module.exports = {
    authenticate: authenticate
};
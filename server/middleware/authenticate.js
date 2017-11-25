var {User} = require('./../models/user');

var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    try {
        User.findByToken(token).then((user) => {
            if(!user) {
                return res.status(401).send();
            }

            req.user  = user;
            req.token = token;
            next();
        });
    } catch(e) {
        res.status(401).send(e.toString());
    }
};

module.exports = {
    authenticate: authenticate
};
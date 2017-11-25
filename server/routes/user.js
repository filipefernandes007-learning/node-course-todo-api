const _  = require('lodash');

/**
 *
 */
var {app}          = require('../server');
var {User}         = require('../models/user'); // the same as var Todo = require('./models/todo').Todo;
var {SysError}     = require('../models/sys-error');
var {ObjectID}     = require('mongodb');
var {authenticate} = require('./../middleware/authenticate')

app.post('/users', (req, res) => {
    var data = req.body

    if(!(data instanceof Object)) {
        return res.status(400).send(new SysError({text: 'Data input is not Object!'}));
    }

    try {
        data = _.pick(data, ['email','password']);

        /**
         *
         */
        var user = new User(data);

        user.save().then((user) => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header({'x-auth': token}).send(user);
        }).catch((e) => {
            res.status(400).send(e);
        });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});



app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);

});


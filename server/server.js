require('./config/config');

/**
 *
 * @type {_}
 */
const _ = require('lodash');

/**
 * Module dependencies.
 */

/**
 * Web app framework
 *
 * @type {*|createApplication}
 */
const express = require('express');

/**
 * Convert json to object
 *
 * @type {Parsers|*}
 */
const bodyParser = require('body-parser');

/**
 *
 */
const utils = require('./utils/utils');

/**
 * Mongo ODM
 *
 * @type {*|Mongoose}
 */
var {mongoose}  = require('./db/mongoose');
var {User}      = require('./models/user');
var {SysError}  = require('./models/sys-error');

/**
 *
 */
var app    = express();
const port = process.env.PORT || 3000;

// middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 *
 */
app.use((req, res, next) => {
    // if is POST or PUT method, must parse JSON
    if(req.method === 'POST' || req.method === 'PUT') {
        try{
            var data = req.body;

            if(_.isEmpty(data)) {
                var strData = JSON.stringify(data);

                throw new Error(`Request body is empty: ${strData}`);
            }

            // if it is an Object treat as it is
            if(data instanceof Object) {
                try {
                    if(utils.isJSON(Object.keys(data)[0])) {
                        console.log('Parse JSON');
                        data = JSON.parse(Object.keys(data)[0]);
                    }

                    req.body = data;
                } catch(e) {
                    res.status(400).send(e.toString());
                }
            }

            next();
        } catch(e) {
            res.status(400).send(e.toString());
        }
    } else {
        next();
    }
});


module.exports = {
    app: app
};

/**
 * Routes
 */
var todoRoutes = require('./routes/todo');
//var userRoutes = require('./routes/user');

if(!module.parent){ 
    var listener = app.listen(port, () => {
        console.log('Server started on port %d', listener.address().port);
    });
}
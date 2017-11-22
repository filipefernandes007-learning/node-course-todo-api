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
var express = require('express');

/**
 * Convert json to object
 *
 * @type {Parsers|*}
 */
var bodyParser = require('body-parser');

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
var app = express();

// middleware
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

/**
 *
 */
app.use((req, res, next) => {
    // if is POST method, must parse JSON
    if(req.method === 'POST') {
        try{
            var data = req.body;

            if(_.isEmpty(data)) {
                var strData = JSON.stringify(data);

                throw new Error(`Request body is empty: ${strData}`);
            }

            // is is an Object treat as it is
            if(data instanceof Object) {
                var data = JSON.parse(Object.keys(data)[0]);

                req.body = data;
            }

            next();
        } catch(e) {
            res.status(400).send(e.toString());
        }
    }
});

module.exports = {
    app: app,
    express: express,
    bodyParse: bodyParser
};

/**
 * Routes
 */
var todoRoutes = require('./routes/todo');
//var userRoutes = require('./routes/user');

app.listen(3000, () => {
    console.log('Listen on port 3000');
});
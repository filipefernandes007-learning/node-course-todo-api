/**
 *
 */
var {app}      = require('../server');
var {Todo}     = require('../models/todo'); // the same as var Todo = require('./models/todo').Todo;
var {SysError} = require('../models/sys-error');

app.post('/todos', (req, res) => {
    try{
        var data = req.body;
        var todo = new Todo(data);

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });

    } catch(e) {
        res.status(400).send(e);
    }
});

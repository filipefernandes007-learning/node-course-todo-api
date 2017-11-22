/**
 *
 */
var {app}      = require('../server');
var {Todo}     = require('../models/todo');
var {SysError} = require('../models/sys-error');

app.post('/todos', (req, res) => {
    try{
        var data = req.body;
        var todo = new Todo(data);

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            var error = new SysError({text: `Error creating todo ${e.toString()}`});

            res.send(error.toString());
        });

    } catch(e) {
        var error = new SysError({text: `Error POST /todos ${e.toString()}`});

        res.status(400).send(error.toString());
    }
});

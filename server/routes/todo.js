/**
 *
 */
var {app}      = require('../server');
var {Todo}     = require('../models/todo'); // the same as var Todo = require('./models/todo').Todo;
var {SysError} = require('../models/sys-error');
var {ObjectID} = require('mongodb');

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

app.get('/todos', (req, res) => {
    try {
        Todo.find().then((result) => {
            res.status(200).send(result);
        }, (e) => {
            res.status(400).send(e);
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

app.get('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send(new SysError({text: 'Id not valid'}));
        }

        Todo.findById(id).then((todo) => {
            if(!todo) {
                return res.status(404)
                          .send(new SysError({text: `Could not found todo with id=${id}`}));
            }

            res.status(200).send(todo);
        }).catch((e) => {
            return res.status(400).send(e.toString());
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

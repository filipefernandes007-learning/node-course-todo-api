/**
 *
 */
var {app}      = require('../server');
var {Todo}     = require('../models/todo'); // the same as var Todo = require('./models/todo').Todo;
var {SysError} = require('../models/sys-error');
var {ObjectID} = require('mongodb');
var {crud}     = require('../db/crud/crud') 

app.post('/todos', (req, res) => {
    try{
        var data = req.body;
        var todo = new Todo(data);

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            throw e;
        });

    } catch(e) {
        res.status(400).send(e.toString());
    }
});

app.get('/todos', (req, res) => {
    try {
        Todo.find().then((result) => {
            res.status(200).send(result);
        }, (e) => {
            throw e;
        });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        Todo.findById(id).then((todo) => {
            if(!todo) {
                throw new Error(new SysError({text: `Could not found todo with id=${id}`}));
            }

            res.status(200).send(todo);
        }).catch((e) => {
            throw e;
        });
    } catch (e) {
        if(e) {
            res.status(400).send(e.toString());
        }
    }
});

app.delete('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo) {
                throw new Error(new SysError({text: `Could not find todo with id=${id}`}));
            }

            res.status(200).send(todo);
        }).catch((e) => {
            throw e;
        });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

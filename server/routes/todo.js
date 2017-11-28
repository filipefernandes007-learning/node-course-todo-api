const _ = require('lodash');

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
        var todo = new Todo({
            text: data.text
        });

        todo.save().then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
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
            res.status(400).send(e);
        });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;

        crud.findById(Todo, id).then((doc) => {
            return res.status(200).send(doc);
        }).catch((e) => {
            res.status(404).send(e.toString());
        });

        /*
        var id = req.params.id;
        
        if(!ObjectID.isValid(id)) {
            return res.status(404).send(new SysError({text: 'Id not valid'}));
        }

        Todo.findById(id).then((todo) => {
            if(!todo) {
                return res.status(404)
                          .send(new SysError({text: `Could not find todo with id=${id}`}));
            }

            res.status(200).send(todo);
        }).catch((e) => {
            res.status(400).send(e.toString());
        });
        */
    } catch (e) {
        if(e) {
            res.status(404).send(e.toString());
        }
    }
});
  
app.delete('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send(new SysError({text: 'Id not valid'}));
        }

        Todo.findByIdAndRemove(id).then((todo) => {
            if(!todo) {
                return res.status(404)
                          .send(new SysError({text: `Could not find todo with id=${id}`}));
            }

            res.send(todo);
        }).catch((e) => {
            res.status(404).send(e.toString());
        });
        
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.patch('/todos/:id', (req, res) => {
    try {
        var id = req.params.id;

        if(!ObjectID.isValid(id)) {
            return res.status(404).send(new SysError({text: 'Id not valid'}));
        }
    
        var body = _.pick(req.body, ['text', 'completed']);
    
        if(_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime();
        } else {
            body.completed   = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
           if(_.isNull(todo)) {
               return res.status(404).send(new SysError({text: `Could not find todo with id=${id}`}));
           }

           res.send(todo);
        }).catch((e) => {
            res.status(400).send(e.toString());
        });

    } catch (e) {
        res.status(400).send(e.toString());
    }
    
});


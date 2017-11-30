const _ = require('lodash');

/**
 *
 */
var {app}      = require('../server');
var {Todo}     = require('../models/todo'); // the same as var Todo = require('./models/todo').Todo;
var {SysError} = require('../models/sys-error');
var {ObjectID} = require('mongodb');
var {crud}     = require('../db/crud/crud');
var {authenticate} = require('./../middleware/authenticate');

/**
 *
 */
app.post('/todos', authenticate, (req, res) => {
    try{
        var data = req.body;
        var todo = new Todo({
            text: data.text,
            _creator: req.user._id
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

app.get('/todos', authenticate, (req, res) => {
    try {
        Todo.find({
            _creator: req.user._id
        }).then((result) => {
            res.status(200).send(result);
        }, (e) => {
            res.status(400).send(e);
        });
    } catch (e) {
        res.status(400).send(e.toString());
    }
});

app.get('/todos/:id', authenticate, (req, res) => {
    try {
        var id = req.params.id;

        Todo.findOne({
            _id: id,
            _creator: req.user._id
        }).then((todo) => {
            if(!todo) {
                return res.status(404).send();
            }

            return res.status(200).send(todo);
        }).catch((e) => {
            res.status(404).send(e.toString());
        });
    } catch (e) {
        if(e) {
            res.status(404).send(e.toString());
        }
    }
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

app.patch('/todos/:id', authenticate, (req, res) => {

    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });

});
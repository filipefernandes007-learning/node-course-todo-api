const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');

var id = '5a15f7e0f9aa98133add0612sd';

if(!ObjectID.isValid(id)) {
    console.log('Id is not valid!');
}

Todo.findById(id).then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e.toString());
});
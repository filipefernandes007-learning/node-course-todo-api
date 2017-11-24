const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo}     = require('./../server/models/todo');
const {User}     = require('./../server/models/user');

/*
var id = '5a15f7e0f9aa98133add0612sd';

if(!ObjectID.isValid(id)) {
    console.log('Id is not valid!');
}

Todo.findById(id).then((res) => {
    console.log(res);
}).catch((e) => {
    console.log(e.toString());
});
*/

//Todo.findOneAndRemove();
//Todo.findByIdAndRemove();

Todo.findOneAndRemove({_id: '5a15f7e0f9aa98133add0612'}).then((todo) => {
  console.log(todo);
});

Todo.findByIdAndRemove('5a15f897f9aa98133add0613').then((todo) => {
  console.log(todo);
});

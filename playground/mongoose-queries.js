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

var id = '5a1550233f993522f8775d43';

User.findById(id).then((user) => {
  if(!ObjectID.isValid(id)) {
    console.log(`Id ${id} is not valid!`);
  }

  if(!user) {
    return console.log('User not found');
  }

  console.log(`User by id: ${id}`, JSON.stringify(user, undefined, 2));
}).catch((e) => {
  console.log(e.toString());
});

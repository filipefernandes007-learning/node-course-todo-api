const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to mondogb sever!');
    }

    console.log('Connected to MongoDB server.');

    /*db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (err, result) => {
        if(err) {
            return console.log('Unable to insert todo', err);
        }

        console.log(JSON.stringify(result.ops, undefined, 2));
    });*/

    /*db.collection('Users').insertOne({
        name: 'Filipe',
        age: 45,
        location: 'Alverca do Ribatejo, Portugal'
    }, (err, result) => {
        if(err) {
            return console.log('Undable to insert user', err);
        }

        //console.log(JSON.stringify(result.ops, undefined, 2));

        console.log(result.ops[0]._id.getTimestamp());
    });*/

    db.close();
});
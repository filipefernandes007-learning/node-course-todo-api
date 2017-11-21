const {MongoClient, ObjectID} = require('mongodb');

try {
    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
        if(err) {
            return console.log('Unable to connect to mondogb server!');
        }

        console.log('Connected to MongoDB server.');

        db.collection('Users').find({
            name: 'Filipe'
        }).toArray().then((docs) => {
            console.log('Todos');
            console.log(JSON.stringify(docs, undefined, 2));
        }, (err) => {
            console.log('Unable to fetch todos', err);
        });

        /*db.collection('Users').find().count().then((count) => {
            console.log('Todos');
            console.log(count);
        }, (err) => {
            console.log('Unable to fetch todos', err);
        });*/
    });
} catch (e) {
    console.error(e.toString());
}


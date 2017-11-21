const {MongoClient, ObjectID} = require('mongodb');

try {
    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
        if(err) {
            return console.log('Unable to connect to mondogb server!');
        }

        console.log('Connected to MongoDB server.');

        // deleteMany
        /*db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
            console.log(result);
        });*/

        /*db.collection('Todos').deleteOne({text: 'Eat today'}).then((result) => {
            console.log(result)
        });*/

        /*
        db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
            console.log(result);
        });
        */

        db.collection('Users').findOneAndDelete({_id: new ObjectID('5a148d14c4431717d16e07ef')}).then((result) => {
            console.log(result);
        });
    });
} catch (e) {
    console.error(e.toString());
}


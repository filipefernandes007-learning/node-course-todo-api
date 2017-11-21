const {MongoClient, ObjectID} = require('mongodb');

try {
    MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
        if(err) {
            return console.log('Unable to connect to mondogb server!');
        }

        console.log('Connected to MongoDB server.');

        /*db.collection('Todos').findOneAndUpdate({
            _id: new ObjectID("5a148f7cb0195ea8363182f1")
        }, {
            $set: {
                completed: true
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });*/

        db.collection('Users').findOneAndUpdate({
            _id: new ObjectID("5a148d01d83bd817cf65725d")
        }, {
            $set: {
                name: 'Xavier'
            },
            $inc: {
                age: 1
            }
        }, {
            returnOriginal: false
        }).then((result) => {
            console.log(result);
        });
    });
} catch (e) {
    console.error(e.toString());
}


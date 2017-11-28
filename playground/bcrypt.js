const {SHA256} = require('crypto-js');
const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');

var password = '123abc!';
var hashedValue;

bcrypt.genSalt(10, (e, salt) => {
    bcrypt.hash(password, salt, function(e, hash) {
        hashedValue = hash;
        console.log(salt, hash);

        bcrypt.compare(password, hashedValue, (e, res) => {
            console.log('Res:', res);
        });
    });
});








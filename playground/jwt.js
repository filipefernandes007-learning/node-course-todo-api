const {SHA256} = require('crypto-js');
const jwt      = require('jsonwebtoken');

// jwt.sign   -> creates the hash and returns the token value
// jwt.verify -> takes the token and secret, and verifies if the token was not manipulated

var data = {
    id: 10
};

var salt  = '123abc';
var token = jwt.sign(data, salt);

// O JWT é uma string dividida em três partes,
// e guarda toda a informação de que precisamos para verificar que os dados não
// foram comprometidos

console.log(token);

// para confirmar que os dados não foram comprometidos, utilizar a ferramenta
// em https://jwt.io

// Parte 1: header
// Parte 2: playload -> our information
// Parte 3: hash -> que permite verificar que o playload nunca foi alterado

try {
    var decodedResult = jwt.verify(token, salt);
    console.log(decodedResult);
} catch(e) {
    console.log(e.toString());
}



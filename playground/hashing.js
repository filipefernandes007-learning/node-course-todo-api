// JWT (Json Web Token)

// Uma forma de verificar que os dados enviados não foram alterados/comprometidos.
// Neste caso é o token que passamos de um lado para o outro.

const {SHA256} = require('crypto-js');

var password = '123';
var hash     = SHA256(password);

console.log(`Password é: ${password}`);
console.log(`Depois de encryptada: ${hash}`);

// The id is the user id
// The data we want send back to the client
var data = {
    id: 4
};

// Saltear o hash significa que se acrescenta alguma coisa ao hash que é único
// Se fizer hash a uma password, obtenho sempre o mesmo resultado
// Se concatenarmos a password a um vaklor gerado aleatoriamente,
// obtenho um resultado diferente.
// Então se usar um salt diferente a cada vez, nunca obtenho o mesmo hash.
// Isto quer dizer que um hacker pode alterar o data.id, mas como desconhece o salt
// nunca vai poder obter o hash correcto: a relação de data e hash não conincide!
// Se for essse o caso, podemos negar o acesso a esse utilizador.
var salt = 'somesecret';

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + salt).toString()
};

// Um token sem salt não é inteiramente seguro
// Imagine-se que um utilizador (man in the middle) altera a propriedade id de data para 5 (data.id = 5)
// o que tem de fazer é o re-hash da data, passar à propriedade hash, e devolver o token
// o que tecnicamente significa que nos tinha enganado.

// Verificar se o token foi manipulado
// O 'man in the middle' não tem acesso ao salt, que se encontra guardado no servidor.
var resultHash = _hash(token, salt);

console.log('Without man the middle');
trust(resultHash, token);
console.log('Verify:', verify(token, salt));

console.log('Man the middle');
token.data.id = 5;
token.hash    = _hash(token, '?');
resultHash    = _hash(token, salt);

trust(resultHash, token);
console.log('Verify:', verify(token, salt));

function _hash(_token, _salt) {
    return SHA256(JSON.stringify(_token.data) + _salt).toString();
}

function trust(_resultHash, _token) {
    if(_resultHash === _token.hash) {
        console.log('Data was not changed');
    } else {
        console.log('Date was changed. Do not trust.');
    }
}

function verify(_token, _salt) {
    return _token.hash === _hash(_token, _salt);
};


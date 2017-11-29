const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.toJSON = function () {
  var user    = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email'])
};

/**
 * methods are allowed to be called only from an instance of the schema:
 *
 * var user = new User({email: ..., password: ..., ...});
 * user.generateAuthToken();
 */
UserSchema.methods.generateAuthToken = function() {
    /**
     *
     * @type {mongoose.Model}
     */
    var user   = this;
    var access = 'auth';
    var token  = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then((res) => {
        return token
    });
};

/**
 * statics are allowed to be called directly from the model: User.findByToken(...)
 * @param token
 * @returns {Promise|Query|void|*}
 */
UserSchema.statics.findByToken = function (token) {
    var User = this; // the model
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');

        if(!decoded._id) {
            throw new Error('Could not find _id from JWT');
        }
    } catch(e) {
        throw e;
        /*
        return new Promise((result, reject) => {
            reject();
        });
        */
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

/**
 *
 * @param email
 * @param password
 * @returns {MPromise|Promise}
 */
UserSchema.statics.findByCredentials = function(email, password) {
    var User = this;

    // find user with email
    return User.findOne({email: email}).then(function(user) {
        if(!user) {
            return Promise().reject();
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (e, result) => {
                if(!result) {
                    reject(new Error('Bad credentials'));
                } else {
                    resolve(user);
                }
            });
        });
    });
};

/**
 *
 * @param token
 */
UserSchema.methods.removeToken = function(token) {
    var user = this;

    return user.update({
       $pull: {
           tokens: {token}
       }
    });
};

/**
 *
 */
UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (e, salt) => {
            bcrypt.hash(user.password, salt, function(e, hash) {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

/**
 *
 */
var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
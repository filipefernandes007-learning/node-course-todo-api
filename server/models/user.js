const mongoose  = require('mongoose');
const validator = require('validator');
const jwt       = require('jsonwebtoken');
const _         = require('lodash');
const bcrypt    = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
        validator: (email) => {
            return validator.isEmail(email);
        }
        /*
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
        */
    },
    password: {
        type: String,
        required: true,
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

UserSchema.methods.toJSON = function () {
  var user    = this;
  var userObj = user.toObject();

  return _.pick(userObj, ['_id', 'email'])
};

/**
 *
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
 */
var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};
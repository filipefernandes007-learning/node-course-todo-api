var mongoose = require('mongoose');

/**
 *
 */
var SysError = mongoose.model('SysError', {
    text: {
        type: String,
        require: true,
        minlength: 1,
        trim: true
    },
});

SysError.toString = () => {
    return JSON.stringify({text: this.text}, undefined, 2);
};

module.exports = {
    SysError: SysError,
};
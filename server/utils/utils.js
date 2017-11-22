const _ = require('lodash');

module.exports = {
    isJSON: (str) => {
        return !_.isError(_.attempt(JSON.parse, str));
    }
};
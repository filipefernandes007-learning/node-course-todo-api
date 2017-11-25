var mongoose     = require('mongoose');
var {ObjectID}   = require('mongodb');
const {SysError} = require('./../../models/sys-error');

var crud = {
    findById: (model, id) => {
        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        return model.findById(id).then((doc) => {
            if(!doc) {
                throw new Error(new SysError({text: `Could not find doc with id=${id}`}));
            }

            return doc;
        }).catch((e) => {
            throw e;
        });
    },
    delete: (model, id) => {
        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        return model.findByIdAndRemove(id).then((doc) => {
            if(!doc) {
                throw new Error(new SysError({text: `Could not found document with id=${id}`}));
            }

           return doc;
        }).catch((e) => {
            throw e;
        });
    }
};

module.exports = {
    crud: crud
}
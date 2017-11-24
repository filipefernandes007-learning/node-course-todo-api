var mongoose     = require('mongoose');
var {ObjectID}   = require('mongodb');
const {SysError} = require('./../../models/sys-error');

var crud = {
    doc: {},
    findById: (model, id, callback) => {
        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        model.findById(id).then((doc) => {
            if(!doc) {
                throw new Error(new SysError({text: `Could not found doc with id=${id}`}));
            }

            callback(doc);
        }).catch((e) => {
            throw e;
        });
    },
    delete: (model, id) => {
        if(!ObjectID.isValid(id)) {
            throw new Error(new SysError({text: 'Id not valid'}));
        }

        model.findByIdAndRemove(id).then((doc) => {
            if(!doc) {
                throw new Error(new SysError({text: `Could not found document with id=${id}`}));
            }

           return doc;
        }).catch((e) => {
            throw e;
        });
    }
};

var crudResponse = {
    findById: (response, model, id) => {
        var doc;

        crud.findById(model, id, (_doc) => {
            doc = doc;
        });

        if(doc) {
            return response.status(200).send(doc);
        }

        return null;
    }
}

module.exports = {
    crud: crud,
    crudResponse: crudResponse
}
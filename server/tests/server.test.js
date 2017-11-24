const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}      = require('../server');
const {Todo}     = require('../models/todo');

var text = 'Test todo text';

const todos = [{
    _id: new ObjectID(),
    text: 'First Todo'
}];

var todoList = [];

/*
beforeEach((done) => {
    Todo.find({text: text}).then((res) => {
        if(res) {
            console.log(res);
        }

        done();
    });
});
*/


describe('POST /todos', () => {
    /*
    it('It should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text: text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((e, res) => {
                if(e) {
                    console.log(e.toString());
                    return done(e);
                }

                Todo.find({text: text}).then((todos) => {

                    expect(todos[0].text).toBe(text);

                    done();
                }).catch((e) => {
                    done(e);
                });

            });

    });
    */

    /*
    it('Should not create todo', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
    */

});

describe('GET /todos', () => {
    it('It should get todos', (done) => {
        request(app)
            .get('/todos')
            .send()
            .expect(200)
            .expect((res) => {
                todoList = res.body;
                expect(res.body.length).toBe(17);
            })
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                done();
            });
    });
});

describe('GET /todos:id', () => {
    it('It should get a todo', (done) => {
         request(app)
            .get(`/todos/${todoList[0]._id}`)
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todoList[0].text);
            })
            .end(done);
    });

    
    it('It should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .send()
            .expect(404)
            .end(done);
    });

    it('It should return 404 for non-object id', (done) => {
        request(app)
            .get('/todos/123abc')
            .send()
            .expect(404)
            .end(done);
                    
    });
    
});
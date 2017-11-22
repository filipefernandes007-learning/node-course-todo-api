const expect    = require('expect');
const request   = require('supertest');

const {app}     = require('../server');
const {Todo}    = require('../models/todo');

var text = 'Test todo text';

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

});

describe('GET /todos', () => {
    it('It should get todos', (done) => {
        request(app)
            .get('/todos')
            .send()
            .expect(200)
            .expect((res) => {
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
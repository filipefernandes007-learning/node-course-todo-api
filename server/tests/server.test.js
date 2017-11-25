const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}      = require('../server');
const {Todo}     = require('../models/todo');

var text = 'Test todo text';

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
},
{
    _id: new ObjectID(),
    text: 'Second test Todo',
    completed: true,
    completedAt: 333
},
];

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
                expect(res.body.length).toBe(todoList.length);
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


describe('PATCH /todos/:id', () => {
    it('It should patch todo', (done) => {
        var id = todoList[0]._id;

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
               expect(res.body.text).toBe(text);
               expect(res.body.completed).toBe(true);
               expect(res.body.completedAt).toBeA('number');
            }).end(done);
    });


    it('It should fail for patch todo', (done) => {
        var id   = todoList[0]._id;
        var text = 'This should be a new test';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
                expect(res.body.completed).toBe(false);
                expect(res.body.completedAt).toNotExist();
            }).end(done);
    });


});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      var id = todoList[0]._id;
  
      request(app)
        .delete(`/todos/${id}`)
        .send()
        .expect(200)
        .expect((res) => {
          expect(res.body._id).toBe(id);
        })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
  
          Todo.findById(id).then((todo) => {
              expect(todo).toBe(null);
            done();
          }).catch((e) => done(e));
        });
    });
  
    it('should return 404 if todo not found', (done) => {
      var id = new ObjectID().toHexString();
  
      request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
  
    it('should return 404 if object id is invalid', (done) => {
      request(app)
        .delete('/todos/123abc')
        .expect(404)
        .end(done);
    });
  });



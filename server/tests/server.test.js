const expect     = require('expect');
const request    = require('supertest');
const {ObjectID} = require('mongodb');

const {app}      = require('../server');
const {Todo}     = require('../models/todo');
const {User}     = require('../models/user');
const {todos,
       populateTodos,
       users,
       populateUsers} = require('./seed/seed');

var text = 'Test todo text';
var todoList = [];

before(populateUsers);
beforeEach(populateTodos);

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

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
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


describe('POST /users', () => {
    var email    = 'abc@example.com';
    var password = '123456';

    it('It should create a new User', (done) => {
        request(app)
            .post('/users')
            .send({email: email, password: password})
            .expect(200)
            .expect((res) => {
                expect(res.body.email).toBe(email);
                expect(res.headers['x-auth']).toExist();
            })
            .end((e) => {
                if(e) {
                    return done(e);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                }).catch((e) => {
                    done(e);
                });

                done();
            });
    });

    it('Should return validation errors if request invalid', (done) => {
        var email    = 'xyz@example.com';
        var password = '123';

        request(app)
            .post('/users')
            .send({email, password})
            .expect(400)
            .end(done);
    });

    it('It should not create if email in use', (done) => {
        request(app)
            .post('/users')
            .send({email: users[0].email, password: '987654'})
            .expect(400)
            .end(done);
    });

});

describe('GET /users', () => {
    it('It should get a user authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set({'x-auth': users[0].tokens[0].token})
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email)
            })
            .end(done);

    });


    it('It should return 401 with wrong jwt signature', (done) => {
        var token = users[0].tokens[0].token.slice(0, -1) + 'Z';

        request(app)
            .get('/users/me')
            .set({'x-auth': token})
            .expect(401)
            .end(done);
    });

    it('It should return 401 if not authenticate', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .end(done);

    });
});

describe('POST /users/login', () => {
    it('It should login and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();

            })
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });

                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });

    it('It should reject login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[0].password + 'z'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();

            })
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.tokens[0]).toNotInclude({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

    });
})


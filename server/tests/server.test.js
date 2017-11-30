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
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .send({}) // ivalid data, at least must have text value
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
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .expect((res) => {
                //todoList = res.body;
                expect(res.body.length).toBe(1);
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
            .get(`/todos/${todos[0]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('It should not return a todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(404)
            .end(done);
    });

    it('It should return a 404 if todo not found', (done) => {
        let id = new ObjectID().toHexString();

        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(404)
            .end(done);
    });

    it('It should return 404 for non-object id', (done) => {
        request(app)
            .get('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .send()
            .expect(404)
            .end(done);

    });
    
});


describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('should not update the todo created by other user', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'This should be the new text';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: true,
                text
            })
            .expect(404)
            .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'This should be the new text!!';

        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
            .end(done);
    });


});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should remove a todo', (done) => {
        var hexId = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if object id is invalid', (done) => {
        request(app)
            .delete('/todos/123abc')
            .set('x-auth', users[1].tokens[0].token)
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
                    users[1] = user;

                    expect(user.tokens[1]).toInclude({
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
                password: users[1].password + 'z'
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
                    expect(user.tokens.length).toBe(2); // don't forget that POST /users/login push a new token

                    done();
                }).catch((e) => {
                    done(e);
                });
            });

    });
});


describe('GET /users/me', () => {
    it('It should get user on token', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                User.findOne(users[0]._id).then((user) => {
                    expect(res.body._id).toBe(user._id.toHexString());
                    expect(res.body.email).toBe(user.email);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});

describe('DELETE /users/me/token', () => {
    it('It should remove user token on logout', (done) => {
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((e, res) => {
                if(e) {
                    return done(e);
                }

                User.findOne(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
});



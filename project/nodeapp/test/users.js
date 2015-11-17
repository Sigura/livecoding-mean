(function (global, require, request) {
  'use strict';

  describe('/api/users', function () {
    describe('register & login', function () {
        var result;
        cleanDb();
        before(function(done) {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                }).then(function(res) {
                    result = res;
                })
                .then(function() {
                    done();
                });
        });
        it('returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('allows to log in as agdudnik@gmail.com', function() {
            return request()
            .post('/api/users')
            .send({
                name: 'agdudnik@gmail.com',
                password: 'test'
            })
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.property('token');
                expect(res.body).to.have.property('id');
            });
        });
    });
    describe('register exists user', function () {
        var result;
        cleanDb();
        before(function(done) {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                })
                .then(function() {
                    done();
                });
        });
        it('returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('agdudnik@gmail.com again', function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .expect(500)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
        it('delete agdudnik@gmail.com', function() {
            return request()
                .delete('/api/users')
                .set('Authorization', result.body.token)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.property('success');
                });
        });
    });
    describe('register with invalid values', function () {
        cleanDb();
        it('returns 200', function() {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: ''
                })
                .expect(400)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('login with invalid values', function () {
        cleanDb();
        it('register returns 200', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: ''
                })
                .expect(400)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
    });
    describe('login with wrong login', function () {
        var result;
        cleanDb();
        before(function(done) {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                })
                .then(function() {
                    done();
                });
        });
        it('returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('main', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik111',
                    password: 'test'
                })
                .expect(404)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
        it('delete agdudnik@gmail.com', function() {
            return request()
                .delete('/api/users')
                .set('Authorization', result.body.token)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.property('success');
                });
        });
    });
    describe('login with wrong password', function () {
        var result;
        cleanDb();
        before(function(done) {
            return request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .then(function(res) {
                    result = res;
                })
                .then(function() {
                    done();
                });
        });
        it('returns 200', function() {
            expect(result.status).to.eql(200);
        });
        it('main', function() {
            return request()
                .post('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test1'
                })
                .expect(403)
                .then(function(res) {
                    expect(res.body).to.have.property('error');
                });
        });
        it('delete agdudnik@gmail.com', function() {
            return request()
                .delete('/api/users')
                .set('Authorization', result.body.token)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.property('success');
                });
        });
    });

  });
})(global || window, require, request);

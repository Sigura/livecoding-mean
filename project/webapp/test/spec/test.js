/* global describe, it */

(function ($, uuid, queryString, sinon) {
    'use strict';
    var user = {
        name: uuid.v4(),
        password: uuid.v4().substring(0, 23)
    };
    sinon.spy($, 'ajax');
    var register = function(usr){

        return $.ajax('/api/users', {
            dataType: 'json',
            contentType: 'application/json',
            method: 'PUT',
            data: JSON.stringify(usr || user),
            success: function(res) {
                user.id = res._id;
                user.token = res.token;
                console.log('registred, current token: ' + res.token);
            }
        });
    };
    var unregister = function () {
        return $.ajax('/api/users', {
            dataType: 'json',
            contentType: 'application/json',
            method: 'DELETE',
            headers: {
                Authorization: user.token
            },
            data: JSON.stringify(user),
            error: function(res) {
                throw JSON.stringify(res.responseJSON);
            },
            success: function(res) {
              console.log('token removed: ' + user.token);
              user.token = null;
            }
        });
    };

    var login = function(){
        return $.ajax('/api/users', {
            dataType: 'json',
            contentType: 'application/json',
            method: 'POST',
            headers: {
                Authorization: user.token
            },
            data: JSON.stringify(user),
            error: function(res) {
                throw JSON.stringify(res.responseJSON);
            },
            success: function(res) {
                user.id = res._id;
                user.token = res.token;
                console.log('login, current token: ' + res.token);
            }
        });
    };

    var expenseInsert = function(expense){
        return function(){
            return $.ajax('/api/expenses', {
                dataType: 'json',
                contentType: 'application/json',
                method: 'PUT',
                headers: {
                    Authorization: user.token
                },
                data: JSON.stringify(expense),
                error: function(res) {
                    throw JSON.stringify(res.responseJSON);
                }
            })
            .then(function(res){
                expense.id = res._id;
                expense.user_id = res.user_id;
                return res;
            });
        }
    };

    var expenseUpdate = function(expense){

        return function(){
            return $.ajax('/api/expenses', {
                dataType: 'json',
                contentType: 'application/json',
                headers: {
                    Authorization: user.token
                },
                method: 'POST',
                data: JSON.stringify(expense),
                error: function(res) {
                    throw JSON.stringify(res.responseJSON);
                }
            })
            .then(function(res){
                expense.id = res._id;
                expense.user_id = res.user_id;

                return res;
            });
        };
    };

    var expenseDelete = function(expense){

        return function(){
            return $.ajax('/api/expenses', {
                dataType: 'json',
                contentType: 'application/json',
                method: 'DELETE',
                headers: {
                    Authorization: user.token
                },
                data: JSON.stringify(expense),
                error: function(res) {
                    throw JSON.stringify(res.responseJSON);
                }
            });
        }
    };

    var expenseGet = function(param){
        param = param || {};
        return function(){

            return $.ajax('/api/expenses?' + queryString.stringify(param), {
                dataType: 'json',
                headers: {
                    Authorization: user.token
                },
                contentType: 'application/json',
                method: 'GET',
                error: function(res) {
                    throw JSON.stringify(res.responseJSON);
                }
            });
        };
    };

  describe('user api', function () {
        var user;

        it('register', function (done) {
            return register()
                .then(function(usr){
                    expect($.ajax.lastCall.returnValue).to.have.property('status').to.equal(200);
                    expect(usr).to.have.property('_id');
                    expect(usr).to.have.property('token');
                    user = usr;
                })
                .then(function () {
                    done();
                });
        });

        it('register with wrong param', function (done) {
            return register({name: 'test', password: ''})
                .fail(function(usr){
                    expect($.ajax.lastCall.returnValue).to.have.property('status').to.equal(400);

                    done();
                });
        });

        it('login', function (done) {
            return login()
                .then(function(usr){
                    expect(usr).to.have.property('token');
                    user = usr;
                })
                .then(function () {
                    done();
                });
        });
        it('unregister', function (done) {
            return unregister()
                .then(function () {
                    done();
                });
        });
   });

  describe('expense api', function () {
    var user;
    var expense = {
        date: '2015-10-10',
        time: '10:10',
        description: 'test expense',
        amount: 10,
        comment: 'comment'
    };

    before(function (done) {
        return register()
            .then(function(usr){
                expect(usr).to.have.property('_id');
                expect(usr).to.have.property('token');
                user = usr;
            })
            .then(function () {
                done();
            });
    });

    it('insert', function (done) {
        return expenseInsert(expense)()
            .then(function(exp){
                expect(exp).to.have.property('_id');
            })
            .then(function () {
                done();
            });
    });
    it('update', function (done) {
        expense.description = 'updated description';

        return expenseUpdate(expense)()
            .then(function(exp){
                expect(exp).to.have.property('_id');
                expect(exp).to.have.property('description').to.equal('updated description');
            })
            .then(function () {
                done();
            });
    });
    it('get', function (done) {
        return expenseGet()()
            .then(function(exp){
                expect(exp).to.have.length(1);
            })
            .then(function () {
                done();
            });
    });
    it('filter one', function (done) {
        return expenseGet({amountFrom:10})()
            .then(function(exp){
                expect(exp).to.have.length(1);
            })
            .then(function () {
                done();
            });
    });
    it('filter two', function (done) {
        return expenseGet({amountFrom:20})()
            .then(function(exp){
                expect(exp).to.have.length(0);
            })
            .then(function () {
                done();
            });
    });
    it('delete', function (done) {
        return expenseDelete(expense)()
            .then(function () {
                done();
            });
    });
    after(function (done) {
        return unregister()
            .then(function () {
                done();
            });
    });
  });

})(jQuery, uuid, queryString, sinon);

+(function () {
'use strict';

    var token, token2;

    var expensesSet = [
        {
            description: 'test expense 1',
            amount: 1,
            date: '2015-01-01',
            time: '10:10'
        },
        {
            description: 'test expense 2',
            amount: 2,
            date: '2015-01-02'
        },
        {
            description: 'test expense 3',
            amount: 3,
            date: '2015-01-03'
        },
        {
            description: 'test expense 4',
            comment: 'comment',
            amount: 4,
            date: '2015-01-04',
            time: '10:10'
        },
        {
            description: 'test expense 5',
            comment: 'comment',
            amount: 5,
            date: '2015-01-05',
            time: '10:10'
        },
        {
            description: 'test expense 6',
            amount: 6,
            date: '2015-01-06',
            time: '10:10'
        },
        {
            description: 'test expense 7',
            amount: 7,
            date: '2015-01-07',
            time: '10:10'
        },
        {
            description: 'test expense 8',
            amount: 8,
            date: '2015-01-08'
        }
    ];

    var registerTestUsers = function() {
        before(function(done) {
            var p1 = request()
                .put('/api/users')
                .send({
                    name: 'agdudnik@gmail.com',
                    password: 'test'
                })
                .expect(200)
                .then(function(res) {
                    token = res.body.token;
                });
            var p2 = request()
                .put('/api/users')
                .send({
                    name: 'test-user2',
                    password: 'test'
                })
                .expect(200)
                .then(function(res) {
                    token2 = res.body.token;
                });
            return Promise.all([p1, p2])
                .then(function() {
                    //console.info('tests will run with: ', JSON.stringify({token: token, token2: token2}))
                    done();
                });
        });
    };

  describe('/api/expenses', function () {
    describe('create', function () {
        var result;
        cleanDb();
        registerTestUsers();

        it('returns 200', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'returns 200',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    //console.info('end', res);
                    result = res.body;
                });
        });
        it('with wrong values, check empty date', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 13,
                    date: '',
                    time: '11:11'
                })
                .expect(400)
                .then(function(res) {
                    //console.log(res.body);
                    expect(res.body)
                        .to.have.property('error')
                        .to.have.property('message');
                    expect(res.body.error).to.have.property('errors')
                        .that.is.a('array')
                        .to.contain.an.item.with.property('msg', 'date format is YYYY-MM-DD');
                });
        });
        it('with wrong values, check null date', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    //date: null,
                    time: '10:10'
                })
                .expect(400)
                .then(function(res) {

                    expect(res.body)
                        .to.have.property('error')
                        .to.have.property('message');
                    expect(res.body.error).to.have.property('errors')
                        .that.is.a('array')
                        .to.contain.an.item.with.property('msg', 'date format is YYYY-MM-DD');
                });
        });
        it('with wrong values, check date 2015-16-16', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-16-16',
                    time: '10:10'
                })
                .expect(400)
                .then(function(res) {

                    expect(res.body)
                        .to.have.property('error')
                        .to.have.property('message');
                    expect(res.body.error).to.have.property('errors')
                        .that.is.a('array')
                        .to.contain.an.item.with.property('msg', 'date format is YYYY-MM-DD');
                });
        });
        it('with wrong values, check time', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:1'
                })
                .expect(400)
                .then(function(res) {

                    expect(res.body)
                        .to.have.property('error')
                        .to.have.property('message');
                    expect(res.body.error).to.have.property('errors')
                        .that.is.a('array')
                        .to.contain.an.item.with.property('msg', 'time format is HH:mm or empty');
                });
        });
        it('check empty time', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'check empty time',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: ''
                })
                .expect(200);
                //.then(function(res) { console.info('ok', res); })
                //.catch(function (err) { console.error(err); });
        });
        it('check null time', function() {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'check null time',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: null
                })
                .expect(200);
                //.catch(function (err) { console.error(err); });
                //.then(function(res) { console.info('ok', res); });
        });
        it('get expenses', function() {
            return request()
                .get('/api/expenses')
                .set('Authorization', token)
                .expect(200)
                .then(function(res) {
                    //console.info(res.body);
                    expect(res.body).to.have.length(3);
                    expect(res.body).to.contain.an.item.with.property('_id', result._id);
                })
                .catch(function (err) { console.error(err); });
        });
        it('check rights', function() {
            return request()
                .get('/api/expenses')
                .set('Authorization', token2)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.length(0);
                });
        });
    });
    describe('expense update', function () {
        var result;
        cleanDb();
        registerTestUsers();
        before(function(done) {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    result = res.body;
                })
                .then(function() {
                    done();
                });
        });

        it('update returns 200', function() {

            var update = {
                id: result._id,
                description: 'update returns 200',
                comment: 'comment1',
                amount: 22,
                date: '2015-03-15',
                time: '10:10'
            };
            return request()
                .post('/api/expenses')
                .set('Authorization', token)
                .send(update)
                .expect(200)
                .then(function(res) {
                    expect(res.body).to.have.property('_id', result._id);
                    expect(res.body).to.have.property('description', update.description);
                });
                //.catch(function (err) { console.error(err); });;
        });
        it('get expenses after update', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(1);
                expect(res.body).to.contain.an.item.with.property('_id', result._id);
                expect(res.body).to.contain.an.item.with.property('description', 'update returns 200');
            });
            //.catch(function (err) { console.error(err); });;
        });
        it('check rights after update', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token2)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('expense delete', function () {
        var result;
        cleanDb();
        registerTestUsers();
        before(function(done) {
            return request()
                .put('/api/expenses')
                .set('Authorization', token)
                .send({
                    description: 'test expense',
                    comment: 'comment',
                    amount: 12,
                    date: '2015-03-16',
                    time: '10:10'
                })
                .expect(200)
                .then(function(res) {
                    result = res.body;
                })
                .then(function() {
                    done();
                });
        });

        it('unexistance', function() {

            var update = {
                id: 100
            };
            return request()
                .delete('/api/expenses')
                .set('Authorization', token)
                .send(update)
                .expect(404);
        });

        it('returns 200', function() {

            var update = {
                id: result._id
            };
            return request()
                .delete('/api/expenses')
                .set('Authorization', token)
                .send(update)
                .expect(200);
        });
        it('check existance', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
        it('check rights after delete', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token2)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });
    });

    describe('check auth', function () {
        cleanDb();
        it('get expenses without token', function() {
            return request()
            .get('/api/expenses')
            .expect(403);
        });
        it('get expenses without token', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', '')
            .expect(403);
        });
    });

    describe('filter expenses', function() {
        cleanDb();
        registerTestUsers();

        before(function(done) {
            Promise.map(expensesSet, function (expense) {
                return request()
                    .put('/api/expenses')
                    .set('Authorization', token)
                    .send(expense)
                    .expect(200);
            })
            .then(function() {
                done();
            });
        });

        it('all accessed', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(expensesSet.length);
            });
        });
        it('check rights', function() {
            return request()
            .get('/api/expenses')
            .set('Authorization', token2)
            .expect(200)
            .then(function(res) {
                expect(res.body).to.have.length(0);
            });
        });

        var options = [
            {
                title: 'load more then 5 amount',
                query: {amountFrom: 5},
                result: 4
            },
            {
                title: 'load less then 5 amount',
                query: {amountTo: 5},
                result: 5
            },
            {
                title: 'load between 2 and 5 amount',
                query: {amountTo: 5, amountFrom: 2},
                result: 4
            },
            {
                title: 'load from 2015-01-03',
                query: {dateFrom: '2015-01-03'},
                result: 6
            },
            {
                title: 'load to 2015-01-07',
                query: {dateTo: '2015-01-07'},
                result: 7
            },
            {
                title: 'load between 2015-01-07 and 2015-01-02 date',
                query: {dateTo: '2015-01-07', dateFrom: '2015-01-02'},
                result: 6
            },
            {
                title: 'load between 1 and 5 amount and between 2015-01-07 and 2015-01-02 date',
                query: {dateTo: '2015-01-07', dateFrom: '2015-01-02', amountTo: 5, amountFrom: 1},
                result: 4
            }
        ];

        options.forEach(function (data) {
            it(data.title, function() {
                return request()
                    .get('/api/expenses?' + queryString.stringify(data.query))
                    .set('Authorization', token)
                    .expect(200)
                    .then(function(res) {
                        expect(res.body).to.have.length(data.result);
                    });
            });
        });

        var badOptions = [
            {
                title: 'amountFrom "wrong number"',
                query: {amountFrom: 'wrong number'}
            },
            {
                title: 'amountTo NaN',
                query: {amountTo: NaN}
            },
            {
                title: 'load between Infinity and "" amount',
                query: {amountTo: Infinity, amountFrom: ''}
            },
            {
                title: 'load from 2015-13-35',
                query: {dateFrom: '2015-13-35'}
            },
            {
                title: 'load to 2015-01',
                query: {dateTo: '2015-01'}
            },
            {
                title: 'all togather',
                query: {ddateTo: '2015-01', dateFrom: '2015-13-35', amountTo: Infinity, amountFrom: ''}
            }
        ];

        badOptions.forEach(function (data) {
            it(data.title, function() {
                return request()
                    .get('/api/expenses?' + queryString.stringify(data.query))
                    .set('Authorization', token)
                    .expect(400);
            });
        });

    });
});

})();

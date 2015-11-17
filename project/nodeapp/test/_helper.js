+(function(global, require){
'use strict';

var mongoose   = require('mongoose');
var config = require('../enviroment');
var user = require('../db/models/user');
var expense = require('../db/models/expense');
var chai = require('chai');
var Promise = require('bluebird');
var request = require('supertest-as-promised');
var queryString = require('query-string');
var App = require('../main');

chai.should();
chai.use(require('chai-things'));

global.expect = chai.expect;
global.lodash = require('lodash');
var app = global.app = (new App()).express;
global.Promise = Promise;
global.queryString = queryString;
global.request = function() {
    return request(app);
};
global.cleanDb = function () {
    before(function(done) {
        return Promise.all([
            user.remove({}),
            expense.remove({})
        ]).then(function(){
            done();
        });
    });
};

before(function(done) {

    console.info('rebuild test db');

    mongoose.connect(config.uri, function(err){
      err && console.error(err);
    });

    mongoose.connection.on('open', function(){ //db.connection is not work too .
      mongoose.connection.db.dropDatabase(function(err) {
        err && console.error(err);
        done();
      });
    });
});

beforeEach(function(){
    //cleanDb();
});

})(global || window, require);

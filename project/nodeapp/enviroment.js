var extend = require('util')._extend;

/*eslint-disable camelcase*/
var mongo  = {
    uri: 'mongodb://localhost/expenses-dev',
    options: {
      mongos: true,
      db: { native_parser: true, safe: true },
      replset: {},
      server: { poolSize: 5 }//,
      //user: 'myUserName',
      //pass: 'myPassword'
    }
  };

mongo.options.server.socketOptions = mongo.options.replset.socketOptions = { keepAlive: 1 };

var prod = extend({}, mongo);
var test = extend({}, mongo);
test.uri = 'mongodb://localhost/expenses-test';
prod.uri = 'mongodb://localhost/expenses';

/*eslint-enable camelcase*/
module.exports = process.env.NODE_ENV === 'test'
  ? test
  : (process.env.NODE_ENV === 'production'
    ? prod
    : mongo
  );

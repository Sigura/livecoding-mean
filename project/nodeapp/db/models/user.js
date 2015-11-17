var Promise = require('bluebird');
var mongoose = require('mongoose');
var connection = require('../connection');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(connection);
var userSchema = new Schema({
    /*eslint-disable camelcase*/
    last_accessed_at: {type: Date, default: Date.now},
    password_hash: {type: String, default: 0},
    /*eslint-enable camelcase*/
    name: {type: String, default: 'empty'},
    token: {type: String, default: null}
});
var schemaName = 'User';
//userSchema.plugin(autoIncrement.plugin, { model: schemaName, field: 'id' });
var user = connection.model(schemaName, userSchema);
var User = Promise.promisifyAll(user);
Promise.promisifyAll(User.prototype);

module.exports = User;

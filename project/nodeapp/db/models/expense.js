var Promise = require('bluebird');
var mongoose = require('mongoose');
var connection = require('../connection');
var Schema = mongoose.Schema;
//var ObjectId = Schema.ObjectId;
//var autoIncrement = require('mongoose-auto-increment');
//autoIncrement.initialize(connection);
var expenseSchema = new Schema({
    description: {type: String, default: 'empty'},
    amount: {type: Number, default: 0},
    comment: {type: String, default: null},
    userid: {type: Schema.ObjectId, ref: 'User'},
    date: {type: Date, default: Date.now},
    time: {type: String, default: null}
});
var schemaName = 'Expense';
//expenseSchema.plugin(autoIncrement.plugin, { model: schemaName, field: 'id' });
var expense = connection.model(schemaName, expenseSchema);
var Expense = Promise.promisifyAll(expense);
Promise.promisifyAll(Expense.prototype);

module.exports = Expense;

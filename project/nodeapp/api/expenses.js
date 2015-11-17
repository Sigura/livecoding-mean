+(function(module, require){
'use strict';

var Expense = require('../db/models/expense');
var error = require('../lib/error');
var Pipes = require('../lib/pipes');
var validate = require('../lib/validate');

var helpers = {
  validate: function (req/*, res, next*/) {
    req.checkBody('date', 'date format is YYYY-MM-DD').isLength(10).isDate();
    req.checkBody('time', 'time format is HH:mm or empty').matches(/^(((\d|)\d:\d\d)|)$/);
    req.checkBody('description', 'description length should be 1-255 chars').isLength(1, 255);
    req.checkBody('amount', 'amount should be number').isFloat();
    req.checkBody('comment', 'comment should be length should less then 1024 chars').isLength(0, 1024);
  },
  expense: function (req) {
    var res = {
      date: req.body.date,
      time: req.body.time,
      description: req.body.description,
      amount: req.body.amount,
      comment: req.body.comment,
      /*eslint-disable camelcase*/
      userid: req.user._id
      /*eslint-enable camelcase*/
    };

    if(req.body.id) {
      res._id = req.body.id;
    }
    if(req.params.id) {
      res._id = req.params.id;
    }

    return res;
  }
};

module.exports = {
  get: new Pipes()
    .add(validate(function (req) {

        req.query.dateFrom   && req.checkQuery('dateFrom', 'date format is YYYY-MM-DD').isLength(10).isDate();
        req.query.dateTo     && req.checkQuery('dateTo', 'date format is YYYY-MM-DD').isLength(10).isDate();
        req.query.amountFrom && req.checkQuery('amountFrom', 'amount should be number').isLength(0, 7).isFloat();
        req.query.amountTo   && req.checkQuery('amountTo', 'amount should be number').isLength(0, 7).isFloat();

    }))
    .done(function (req, res/*, next*/) {

      /*eslint-disable camelcase*/
      var query = Expense.where('userid').equals(req.user._id);
      /*eslint-enable camelcase*/

      if(req.query.dateFrom) {
        query = query.where('date').gte(req.query.dateFrom);
      }
      if(req.query.dateTo) {
        query = query.where('date').lte(req.query.dateTo);
      }
      if(req.query.amountFrom) {
        query = query.where('amount').gte(req.query.amountFrom);
      }
      if(req.query.amountTo) {
        query = query.where('amount').lte(req.query.amountTo);
      }

      query
        .sort({date: 'asc', time: 'asc'})
        .then(function(row) {
          res.json(row);
        })
        .catch(function(ex) {
          error(res, ex, 500);
        });

    }),
  put: new Pipes()
    .add(validate(helpers.validate))
    .done(function (req, res/*, next*/) {
      var data = helpers.expense(req);

      /*eslint-disable camelcase*/
      data.time = data.time || null;
      data.userid = req.user._id;

      var expense = new Expense(data);

      //console.log('expense.saveAsync', expense, data);

      expense.saveAsync()
        .spread(function(item) {
          //console.info(item);
          if (!item._id) {
            throw 'failed to create a expense';
          }

          res.json(item);
        })
        .catch(function(ex) {
          //console.error('put with exception', arguments);
          //error(res, ex, 500);
          throw ex;
        });
      /*eslint-enable camelcase*/

    }),
  post: new Pipes()
    .add(validate(helpers.validate))
    .done(function (req, res/*, next*/) {

      var expense = helpers.expense(req);

      /*eslint-disable camelcase*/
      Expense.findOneAndUpdateAsync({_id: expense._id, userid: req.user._id}, expense)
        .then(function(result) {
          if(!result){
            throw 'failed to update expense ' + expense._id;
          }

          res.json(expense);
        })
        .catch(function(ex) {
          console.info(expense);
          error(res, ex, 404, 'api.expenses[post] failed ' + JSON.stringify(expense));
          //throw ex;
        });
      /*eslint-enable camelcase*/

    }),
  delete: function (req, res/*, next*/) {
    var expense = helpers.expense(req);

    /*eslint-disable camelcase*/
    Expense.findOneAndRemove({_id: expense._id, userid: req.user._id})
    /*eslint-enable camelcase*/
      .then(function(result) {
        if(!result){
          throw 'failed to delete expense id: ' + expense._id + ', userId: ' + req.user._id;
        }

        res.json(expense);
      })
      .catch(function(ex) {
        error(res, ex, 404, 'api.expenses[delete] failed ' + JSON.stringify(expense));
      });

  }
};

})(module, require);

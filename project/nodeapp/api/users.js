'use strict';

var uuid = require('node-uuid');
var User = require('../db/models/user');
//var Expense = require('../db/models/expense');
var error = require('../lib/error');
var validate = require('../lib/validate');
var Pipes = require('../lib/pipes');
var hash = require('../lib/hash');

module.exports = {
  get: function(req, res/*, next*/){

    User.findOneAsync({id: req.user.id})
    .then(function(user) {
      if (!user) {
          var err = new Error('User not found');

          error(res, err, 404);

          return;
      }
      res.json(user);
    })
    .catch(function(ex){
        error(res, ex, 500);
    });

  },
  post: new Pipes()
    .add(validate(function(req) {

      req.checkBody('name', 'name should be not empty').notEmpty();
      req.checkBody('password', 'password should be not empty').notEmpty();

    }))
    .done(function(req, res, next) {

      /*eslint-disable camelcase, no-spaced-func*/
      var name = req.body.name;
      var password = req.body.password;
      var token, id, last_accessed_at;

      User.findOneAsync({name: name})
        .then(function(row) {
          if (row) {
            return row;
          }

          error(res, 'user not found', 404);

          return false;
        })
        .then(function(row) {
          if (!row) {
            return false;
          }

          var isValid = hash(password) === row.password_hash;

          if (!isValid) {
            error(res, 'wrong password', 403);

            return false;
          }

          id = row.id;
          row.token = token = uuid.v4();
          row.last_accessed_at = last_accessed_at = new Date();

          return row.saveAsync();
        })
        .then(function(result) {
          if(!result){
            return false;
          }

          res.json({
            id: id,
            token: token,
            last_accessed_at: last_accessed_at
          });
        })
        .catch (next);
      /*eslint-enable camelcase, no-spaced-func*/
    }),
  //],
  put: new Pipes()
    .add(validate(function(req) {

      req.checkBody('name', 'name length should be 1-255 chars').isLength(1, 255);
      req.checkBody('password', 'password length should be 1-25 chars').isLength(1, 25);

    }))
    .done(function(req, res/*, next*/) {

      /*eslint-disable camelcase*/
      var name = req.body.name;
      var password = req.body.password;
      var token, last_accessed_at;

      User.findOneAsync({name: name})
        .then(function(row) {
          if (row) {
            throw 'User "' + name + '" already exists';
          } else {
            return true;
          }
        })
        .then(function () {

          token = uuid.v4();
          last_accessed_at = new Date();

          var user = new User({
            name: name,
            password_hash: hash(password),
            token: token,
            last_accessed_at: last_accessed_at
          });

          return user.saveAsync();
        })
        .spread(function(user) {
          if(!user){
            throw 'failed to create a user, insert failed';
          }

          res.json(user);
        })
        .catch(function(ex) {
          error(res, ex, 500);
        });
      /*eslint-enable camelcase*/

    }),
  delete: function(req, res/*, next*/) {
    User.findOneAndRemoveAsync({_id: req.user._id})
      .then(function(result) {
          if(!result){
              throw 'failed to delete user ' + req.user._id;
          }

          res.json({success: true});
      })
      .catch(function(ex) {
          error(res, ex, 500, 'could not delete user ' + req.user._id);
      });

    }
};

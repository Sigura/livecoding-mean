'use strict';

var route = function() {
  this.calls = [];
};

route.prototype.add = function(call) {
  this.calls.push(call);

  return this;
};

route.prototype.done = function(call) {
  var _ = this;
  this.calls.push(call);

  return function (req, res, next) {
    var calls = _.calls.slice();
    var newNext = function() {
      if(res.headersSent || !calls.length) {
        next && next();
      }
      var first = calls.shift();
      var result = first && first(req, res, newNext);

      return result;
    };

    return newNext();
  };
};

module.exports = route;

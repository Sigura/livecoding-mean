+(function(module, require/*, process*/){

    var mongoose   = require('mongoose');
    var config = require('../enviroment');

    module.exports = mongoose.createConnection(config.uri, config.options);

})(module, require/*, process*/);

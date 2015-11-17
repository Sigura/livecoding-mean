+(function(module){
'use strict';

module.exports = function(validateFn) {
    return function(req, res, next) {
        validateFn(req);

        var errors = req.validationErrors();
        if (errors) {
            console.info('errors in validation:', errors);

            res.status(400);
            res.json({
                error: {
                    message: 'invalid parameters',
                    errors: errors
                }
            });
        } else {
            next();
        }
    };
};

})(module);

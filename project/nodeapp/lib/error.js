module.exports = function(res, text, num, toLog){
'use strict';

    console.error('lib\\error', num, text, toLog || '');

    res.status(num || 500);

    res.json({error: text});

};

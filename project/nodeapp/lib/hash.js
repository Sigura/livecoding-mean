module.exports = function(x) {
    var crypto = require('crypto');
    var salt = '924BDF99-E383-41D6-A56E-1283BF62EEA9';
    var hash = crypto.createHash('sha1')
        .update(salt + x)
        .digest('base64');

    return hash;
};

var _ = require('underscore');
var req = require('../../util/request.js');

var vm = function(done) {
    if (done) {
        done(null, this);
    }
};

module.exports = vm;
var _ = require('underscore');
var title = require('../../util/title.js');

var vm = function(done) {
    title('Privacy');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
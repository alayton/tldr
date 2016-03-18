var _ = require('underscore');
var title = require('../../util/title.js');
var req = require('../../util/request.js');

var vm = function(done) {
    title('Page Not Found');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
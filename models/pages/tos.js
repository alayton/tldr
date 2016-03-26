var _ = require('underscore');
var title = require('../../util/page/title.js');

var vm = function(done) {
    title('Terms of Service');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
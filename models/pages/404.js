var _ = require('underscore');
var title = require('../../util/page/title.js');

var vm = function(done) {
    title(this, 'Page Not Found');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
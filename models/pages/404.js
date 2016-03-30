var _ = require('underscore');

var vm = function(done) {
    this.title = 'Page Not Found';

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
var title = require('../../util/page/title.js');

var vm = function(done) {
    title(this, 'Terms of Service');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
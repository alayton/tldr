var title = require('../../util/page/title.js');

var vm = function(done) {
    title(this, 'About');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
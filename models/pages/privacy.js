var title = require('../../util/page/title.js');

var vm = function(done) {
    title(this, 'Privacy');

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
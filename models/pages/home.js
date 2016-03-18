var _ = require('underscore');
var title = require('../../util/title.js');
var req = require('../../util/request.js');

var vm = function(done) {
    this.tags = null;

    title();

    req({
        endpoint: '/tag/children/0'
    }, true).then(_.bind(function(data) {
        this.tags = data.children;
        if (done) done(null, this);
    }, this));
};

module.exports = vm;
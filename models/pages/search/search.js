var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var title = require('../../../util/page/title.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    var self = this;

    var query = param(params, 'q', '');
    layout.search(query);

    title(query ? query + ' - Search' : 'Search');

    req({
        endpoint: '/search?q=' + query
    }).then(function(data) {
        self.result = data;

        if (done) done(null, self);
    });
};

module.exports = vm;
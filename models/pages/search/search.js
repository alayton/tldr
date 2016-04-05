var _ = require('underscore');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');

var vm = function(params, done) {
    var self = this;
    self.ratings = null;

    var query = param(params, 'q', '');
    layout.search(query);

    var page = param(params, 'page', 1);

    title(this, query ? query + ' - Search' : 'Search');

    req({
        endpoint: '/search?q=' + query + '&page=' + page
    }, this).then(function(data) {
        self.result = data;

        if (done) {
            done(null, self);
        } else if (auth.key()) {
            var ids = _.pluck(self.result.guides, 'id');
            if (ids && ids.length > 0) {
                req({
                    endpoint: '/rateguide/' + ids.join(',')
                }).then(function(data) {
                    self.ratings = data.ratings;
                });
            }
        }
    });
};

module.exports = vm;
var _ = require('underscore');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    var self = this;
    self.ratings = null;

    var query = param(params, 'q', '');
    layout.search(query);

    this.title = query ? query + ' - Search' : 'Search';

    req({
        endpoint: '/search?q=' + query
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
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = null;
    this.ratings = null;

    var page = param(params, 'page', 1),
        unfinished = param(params, 'unfinished', false);

    this.unfinished = !!unfinished;

    title(this, 'Recent Guides');

    req({
        endpoint: '/recent/guides' + '?page=' + page
    }, unfinished ? undefined : this).then(function(data) {
        this.guides = data.guides;
        this.pagination = {
            page: data.page,
            total_results: data.total_results,
            results_per_page: data.results_per_page
        };

        if (auth.key()) {
            var ids = _.pluck(this.guides, 'id');
            if (ids && ids.length > 0) {
                req({
                    endpoint: '/rateguide/' + ids.join(',')
                }).then(_.bind(function(data) {
                    this.ratings = data.ratings;
                }, this));
            }
        }

        if (done) done(null, this);
    }.bind(this));
};

vm.prototype = {
    //
};

module.exports = vm;
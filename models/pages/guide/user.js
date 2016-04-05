var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = null;
    this.user = { id: 0, username: '???' };
    this.ratings = {};

    if (done) {
        done(null, this);
    } else {
        var userId = parseInt(param(params, 'id', 0));
        var page = param(params, 'page', 1);

        req({
            endpoint: '/userguides/' + userId + '?page=' + page
        }).then(_.bind(function(data) {
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
        }, this));

        if (userId > 0) {
            req({
                endpoint: '/user/' + userId
            }).then(_.bind(function(data) {
                this.user = data.user;

                title(this, this.user.username + "'s Guides");
            }, this));
        } else {
            this.user = auth.user();

            title(this, this.user.username + "'s Guides");
        }
    }
};

vm.prototype = {
    //
};

module.exports = vm;
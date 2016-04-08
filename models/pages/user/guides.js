var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = [];
    this.user = { id: 0, username: '???' };
    this.ratings = {};

    var userId = parseInt(param(params, 'id', 0)),
        page = param(params, 'page', 1);

    if (!userId && done) {
        done(null, this);
    } else {
        var promises = [];

        promises.push(req({
            endpoint: '/userguides/' + userId + '?page=' + page
        }).then(function(data) {
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
                    }).then(function(data) {
                        this.ratings = data.ratings;
                    }.bind(this));
                }
            }
        }.bind(this)));

        if (userId > 0) {
            promises.push(req({
                endpoint: '/user/' + userId
            }).then(function(data) {
                this.user = data.user;

                title(this, this.user.username);
            }.bind(this)));
        } else {
            this.user = auth.user();

            title(this, this.user.username);
        }

        m.sync(promises).then(function() {
            if (done) done(null, this);
        }.bind(this));
    }
};

vm.prototype = {
    //
};

module.exports = vm;
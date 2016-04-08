var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.images = [];
    this.user = { id: 0, username: '???' };

    var userId = parseInt(param(params, 'id', 0)),
        page = param(params, 'page', 1);

    if (done) {
        done(null, this);
    } else {
        req({
            endpoint: '/userimages/' + userId + '?page=' + page
        }).then(function(data) {
            this.images = data.images;
            this.pagination = {
                page: data.page,
                total_results: data.total_results,
                results_per_page: data.results_per_page
            };
        }.bind(this));

        if (userId > 0) {
            req({
                endpoint: '/user/' + userId
            }).then(function(data) {
                this.user = data.user;

                title(this, this.user.username);
            }.bind(this));
        } else {
            this.user = auth.user();

            title(this, this.user.username);
        }
    }
};

vm.prototype = {
    //
};

module.exports = vm;
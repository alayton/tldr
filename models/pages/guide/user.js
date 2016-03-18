var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('../../auth.js');
var title = require('../../../util/title.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var layout = require('../../../views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = null;
    this.user = { username: '???' };

    if (done) {
        done(null, this);
    } else {
        var userId = parseInt(param(params, 'id', 0));

        req({
            endpoint: '/userguides/' + userId
        }).then(_.bind(function(data) {
            this.guides = data.guides;
        }, this));

        if (userId > 0) {
            req({
                endpoint: '/user/' + userId
            }).then(_.bind(function(data) {
                this.user = data.user;

                title(this.user.username + "'s Guides");
            }, this));
        } else {
            this.user = auth.user();

            title(this.user.username + "'s Guides");
        }
    }
};

vm.prototype = {
    //
};

module.exports = vm;
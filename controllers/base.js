var _ = require('underscore');
var req = require('../util/request.js');
var canonical = require('../util/page/canonical.js');
var layout = require('../views/layout/skeleton.js');
var auth = require('../models/auth.js');

var base = function(controller) {
    return function(params, done) {
        layout.errors().length = 0;
        layout.notices().length = 0;

        if (!auth.user() && auth.key()) {
            req({
                endpoint: '/user'
            }).then(function(data) {
                if (data.ok) {
                    auth.user(data.user);
                }
            });
        }

        canonical(null);

        return controller(params, done);
    };
};

module.exports = base;
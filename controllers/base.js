var req = require('util/request.js');
var ogImage = require('util/page/og-image.js');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');

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

        var vm = controller(params, done);
        vm._reqs = {};

        if (!vm.ogImage) {
            ogImage(vm);
        }

        return vm;
    };
};

module.exports = base;
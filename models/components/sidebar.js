var _ = require('underscore');
var m = require('mithril');
var moment = require('moment');
var req = require('util/request.js');
var supports = require('util/supports.js');

var vm = function(params, done) {
    var self = this;
    self.activity = [];
    self.loaded = false;

    var activity = supports.localStorage() ? JSON.parse(localStorage.getItem('sidebar-activity')) : null,
        collapsed = supports.localStorage() ? JSON.parse(localStorage.getItem('collapse-sidebar')) : false;
    if (!activity) activity = { count: 0, last: null };

    req({
        endpoint: '/activity',
        method: 'GET',
        background: true
    }).then(function(data) {
        self.activity = data.activity.slice(0, 10);
        self.loaded = true;

        if (supports.localStorage()) {
            activity.count = 0;
            if (collapsed) {
                _.each(self.activity, function(a) {
                    if (moment(a) > activity.last) activity.count++;
                });
            } else {
                activity.last = moment().format();
            }
            localStorage.setItem('sidebar-activity', JSON.stringify(activity));
        }
        m.redraw();

        if (done) done(null, self);
    }, function() {
        self.loaded = true;
    });
};

vm.prototype = {
    //
};

module.exports = vm;
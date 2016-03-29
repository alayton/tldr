var m = require('mithril');
var _ = require('underscore');
var auth = require('../../../models/auth.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var layout = require('../../../views/layout/skeleton.js');

var vm = function(params, done) {
    var token = param(params, 'token', false);

    if (!token) {
        m.route('/');
    }

    this.title = 'Activate Your Account';

    if (done) {
        done(null, this);
    } else {
        req({
            method: 'POST',
            endpoint: '/user/activate',
            data: {
                token: token
            }
        }, this).then(_.bind(function(data) {
            auth.key(data.token);
            auth.user(data.user);

            m.route('/');
        }, this), _.bind(function(data) {
            m.route('/');

            layout.errors().push('Activation failed: ' + data.error);
        }, this));
    }
};

module.exports = vm;
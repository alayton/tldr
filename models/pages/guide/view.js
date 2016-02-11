var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    this.guide = null;
    this.body = null;
    this.error = null;

    var guideId = parseInt(param(params, 'id', 0));

    if (!guideId) {
        this.guide = false;
        return;
    }

    req({
        endpoint: '/guide/' + guideId
    }, true).then(_.bind(function(data) {
        this.guide = data.guide;
        this.body = JSON.parse(this.guide.body);
        if (done) done(null, this);
    }, this), _.bind(function(data) {
        this.guide = false;
        this.error = data.error;
        if (done) done(null, this);
    }, this));
};

vm.prototype = {
    //
};

module.exports = vm;
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('../../../models/auth.js');
var canonical = require('../../../util/page/canonical.js');
var guideurl = require('../../../util/guideurl.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    this.guide = null;
    this.body = null;
    this.error = null;
    this.ratings = null;

    var guideId = parseInt(param(params, 'id', 0));

    if (!guideId) {
        this.guide = false;
        return;
    }

    req({
        endpoint: '/guide/' + guideId
    }, this).then(_.bind(function(data) {
        this.guide = data.guide;
        this.body = JSON.parse(this.guide.body);

        this.title = this.guide.title;
        canonical(this, guideurl(this.guide));

        if (done) {
            done(null, this);
        } else if (auth.key()) {
            req({
                endpoint: '/rateguide/' + this.guide.id
            }).then(_.bind(function(data) {
                this.ratings = data.ratings;
            }, this));
        }
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
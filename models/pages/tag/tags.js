var _ = require('underscore');
var m = require('mithril');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var title = require('../../../util/page/title.js');

var vm = function(params, done) {
    this.tag = null;
    this.tags = null;

    var tagId = parseInt(param(params, 'id', 0));

    req({
        endpoint: '/tag/children/' + tagId
    }, this).then(_.bind(function(data) {
        this.tag = data.tag;
        this.tags = data.children;

        title(this, this.tag.name);

        if (done) done(null, this);
    }, this));
};

vm.prototype = {};

module.exports = vm;
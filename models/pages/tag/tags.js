var _ = require('underscore');
var m = require('mithril');
var title = require('../../../util/page/title.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    this.tag = null;
    this.tags = null;

    this.editingTag = m.prop(null);

    var tagId = parseInt(param(params, 'id', 0));

    req({
        endpoint: '/tag/children/' + tagId
    }, true).then(_.bind(function(data) {
        this.tag = data.tag;
        this.tags = data.children;

        title(this.tag.name);

        if (done) done(null, this);
    }, this));
};

vm.prototype = {
    createTag: function() {
        this.editingTag(0);
    },
    editTag: function(id) {
        this.editingTag(id);
    }
};

module.exports = vm;
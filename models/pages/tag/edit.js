var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    var self = this;

    self.saving = m.prop(false);
    self.saved = m.prop(false);

    self.error = m.prop(null);
    self.nameError = m.prop(null);

    var id = parseInt(param(params, 'id', 0));

    self.tagId = id;
    self.tag = {
        id: 0,
        category: 0,
        name: m.prop(''),
        image: m.prop(0),
        leaf: m.prop(false),
        allowLeafs: m.prop(false)
    };
    self.children = [];

    if (id > 0) {
        req({
            endpoint: '/tag/children/' + id
        }, true).then(_.bind(function(data) {
            var tag = data.tag;
            self.tag.id = tag.id;
            self.tag.parent_id = tag.parent_id;
            self.tag.category_id = tag.category_id;
            self.tag.image(tag.image_id);
            self.tag.name(tag.name);
            self.tag.leaf(tag.leaf);
            self.tag.allowLeafs(tag.allow_leafs);

            self.children = data.children;

            if (done) done(null, this);
        }, this));
    } else if (done) {
        done(null, this);
    }
};

vm.prototype = {
    save: function(self, e) {
        e.preventDefault();

        if (self.saving()) {
            return false;
        }

        self.saving(true);
        var tag = {
            name: self.tag.name(),
            parent_id: self.tag.parent_id,
            category_id: self.tag.category_id,
            image_id: self.tag.image(),
            leaf: self.tag.leaf(),
            allow_leafs: self.tag.allowLeafs()
        };

        req({
            method: self.tag.id ? 'PUT' : 'POST',
            endpoint: self.tag.id ? '/tag/' + self.tag.id : '/tag',
            data: tag
        }).then(function(data) {
            self.saving(false);
            self.saved(true);

            _.delay(function() {
                self.saved(false);
            }, 15000);
        }, function(err) {
            if (err.field_errors) {
                if (err.field_errors.Name) {
                    self.nameError(err.field_errors.Name);
                }
            }

            if (err.error) {
                self.error(err.error);
            }

            self.saving(false);
        });

        return false;
    }
};

module.exports = vm;
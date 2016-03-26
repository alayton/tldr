var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var title = require('../../../util/page/title.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');

var vm = function(params, done) {
    var self = this;

    self.saving = m.prop(false);
    self.saved = m.prop(false);

    self.error = m.prop(null);
    self.nameError = m.prop(null);

    var id = parseInt(param(params, 'id', 0));
    var parent = parseInt(param(params, 'parent', 0));

    self.tagId = id;
    self.tag = {
        id: 0,
        category_id: 0,
        parent_id: 0,
        name: m.prop(''),
        image: m.prop(0),
        leaf: m.prop(false),
        allowLeafs: m.prop(false)
    };
    self.parent = null;
    self.children = [];

    if (id > 0) {
        req({
            endpoint: '/tag/children/' + id
        }, true).then(function(data) {
            if (!data.tag) {
                if (done) {
                    done(null, self);
                } else {
                    m.route('/404');
                }
                return;
            }

            var tag = data.tag;
            self.tag.id = tag.id;
            self.tag.parent_id = tag.parent_id;
            self.tag.category_id = tag.category_id;
            self.tag.image(tag.image_id);
            self.tag.name(tag.name);
            self.tag.leaf(tag.leaf);
            self.tag.allowLeafs(tag.allow_leafs);

            self.children = data.children;

            req({
                endpoint: '/tag/get/' + tag.parent_id
            }, true).then(function(data) {
                var tag = data.tag;
                self.parent = tag;
                self.parent.image = m.prop(tag.image_id);
                self.parent.name = m.prop(tag.name);
                self.parent.leaf = m.prop(tag.leaf);
                self.parent.allowLeafs = m.prop(tag.allow_leafs);

                if (done) done(null, self);
            });
        });
    } else if (parent > 0) {
        req({
            endpoint: '/tag/children/' + parent
        }, true).then(function(data) {
            var tag = data.tag;
            self.tag.parent_id = tag.id;
            if (tag.category_id > 0) {
                self.tag.category_id = tag.category_id;
            } else if (tag.allow_leafs) {
                self.tag.category_id = tag.id;
            }

            self.parent = tag;
            self.parent.image = m.prop(tag.image_id);
            self.parent.name = m.prop(tag.name);
            self.parent.leaf = m.prop(tag.leaf);
            self.parent.allowLeafs = m.prop(tag.allow_leafs);

            title('New Tag');

            if (done) done(null, self);
        });
    } else {
        if (done) {
            done(null, self);
        } else {
            m.route('/404');
        }
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
            if (self.tag.id) {
                self.saving(false);
                self.saved(true);

                _.delay(function() {
                    self.saved(false);
                }, 15000);
            } else {
                m.route('/tag/edit/' + data.tag.id);
            }
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
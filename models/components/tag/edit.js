var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var req = require('../../../util/request.js');

var vm = function(id) {
    var self = this;

    self.saving = m.prop(false);
    self.error = m.prop(null);
    self.nameError = m.prop(null);

    self.tagId = id;
    self.tag = {
        id: 0,
        category: 0,
        name: m.prop(''),
        image: m.prop(0),
        leaf: m.prop(false),
        allowLeafs: m.prop(false)
    };

    if (id() > 0) {
        req({
            endpoint: '/tag/list/' + id()
        }, true).then(function(data) {
            if (data.tags && data.tags.length > 0) {
                var tag = data.tags[0];
                self.tag.id = tag.id;
                self.tag.category = tag.category_id;
                self.tag.name(tag.name);
                self.tag.image(tag.image_id);
                self.tag.leaf(tag.leaf);
                self.tag.allowLeafs(tag.allow_leafs);
            }
        });
    }
};

vm.prototype = {
    close: function() {
        this.tagId(null);
    },
    submit: function(self) {
        if (self.saving()) {
            return;
        }

        self.saving(true);
        var tag = {
            name: self.tag.name(),
            image: self.tag.image(),
            leaf: self.tag.leaf(),
            allow_leafs: self.tag.allowLeafs()
        };

        req({
            method: self.tag.id ? 'PUT' : 'POST',
            endpoint: self.guide.id ? '/tag/' + self.tag.id : '/tag',
            data: tag
        }).then(function(data) {
            self.saving(false);
            self.close();

            m.route(m.route());
        }, function(err) {
            if (err.field_errors) {
                if (err.field_errors.Email) {
                    self.emailError(err.field_errors.Email);
                }
                if (err.field_errors.Username) {
                    self.usernameError(err.field_errors.Username);
                }
                if (err.field_errors.Password) {
                    self.passwordError(err.field_errors.Password);
                }
            }

            if (err.error) {
                self.error(err.error);
            }

            self.saving(false);
        });
    }
};

module.exports = vm;
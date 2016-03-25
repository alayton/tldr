var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var title = require('../../../util/title.js');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var skeleton = require('../../../views/layout/skeleton.js');

var vm = function(params, done) {
    this.guide = null;
    this.body = [];
    this.tags = [];
    this.error = null;
    this.saving = m.prop(false);
    this.saved = m.prop(false);
    this.fieldErrors = {};

    this.savedGuide = {
        category_id: 0,
        image_id: 0,
        status: 0,
        title: '',
        tags: [],
        suggestions: []
    };

    var guideId = parseInt(param(params, 'id', 0));

    if (!guideId) {
        var catg = parseInt(param(params, 'catg', 0));
        if (!catg) {
            this.error = 'No category given!';
            if (done) done(null, this);
            return;
        }

        title('New Guide');

        this.guide = {
            category_id: catg,
            image_id: 0,
            status: m.prop(0),
            title: m.prop(''),
            tags: [],
            suggestions: []
        };

        this.body.push({
            text: m.prop(''),
            image: m.prop(0)
        });

        req({
            endpoint: '/tag/children/' + catg
        }).then(_.bind(function(data) {
            this.guide.category = data.tag;
            this.guide.category_id = data.tag.id;
            this.tags = data.children;
            if (done) done(null, this);
        }, this), _.bind(function(data) {
            this.error = data.error;
            if (done) done(null, this);
        }, this));
    } else {
        req({
            endpoint: '/guide/' + guideId
        }, true).then(_.bind(function(data) {
            this.guide = data.guide;
            this.body = JSON.parse(this.guide.body);

            this.savedGuide = JSON.parse(JSON.stringify(data.guide));

            this.guide.status = m.prop(this.guide.status);
            this.guide.title = m.prop(this.guide.title);

            _.each(this.body, function(s) {
                s.text = m.prop(s.text || '');
                s.image = m.prop(s.image || 0);
            });

            req({
                endpoint: '/tag/children/' + this.guide.category_id
            }).then(_.bind(function(data) {
                this.tags = data.children;

                if (done) done(null, this);
            }, this));
        }, this), _.bind(function(data) {
            this.error = data.error;
            if (done) done(null, this);
        }, this));
    }
};

vm.prototype = {
    onunload: function(e) {
        if (typeof confirm != 'undefined' && this.isModified() && !confirm('Do you want to leave the page? Any unsaved changes will be lost.')) {
            e.preventDefault();
        }
    },
    isModified: function() {
        if (this.guide.id != this.savedGuide.id ||
            this.guide.category_id != this.savedGuide.category_id ||
            this.guide.image_id != this.savedGuide.image_id ||
            this.guide.status() != this.savedGuide.status ||
            this.guide.title() != this.savedGuide.title) {
            return true;
        }

        var body = [];
        _.each(this.body, function(s) {
            body.push({
                text: s.text(),
                image: s.image()
            });
        });

        if (JSON.stringify(body) != this.savedGuide.body) {
            return true;
        }

        var tags = _.intersection(_.pluck(this.guide.tags, 'id'), _.pluck(this.savedGuide.tags, 'id'));
        if (tags.length != this.savedGuide.tags.length || tags.length != this.guide.tags.length) {
            return true;
        }

        var guides = _.intersection(_.pluck(this.guide.suggestions, 'id'), _.pluck(this.savedGuide.suggestions, 'id'));
        if (guides.length != this.savedGuide.suggestions.length || guides.length != this.guide.suggestions.length) {
            return true;
        }

        return false;
    },
    save: function(self) {
        if (self.saving()) {
            return;
        }

        self.saving(true);
        var body = [];
        _.each(self.body, function(s) {
            body.push({
                text: s.text(),
                image: s.image()
            });
        });

        var data = {
            category: self.guide.category_id,
            image: self.guide.image_id,
            status: parseInt(self.guide.status()),
            title: self.guide.title(),
            body: JSON.stringify(body),
            tags: _.pluck(self.guide.tags, 'id'),
            suggestions: self.guide.suggestions ? _.pluck(self.guide.suggestions, 'id') : []
        };

        req({
            method: self.guide.id ? 'PUT' : 'POST',
            endpoint: self.guide.id ? '/guide/' + self.guide.id : '/guide',
            data: data
        }).then(function(data) {
            self.fieldErrors = {};

            if (self.guide.id) {
                self.saving(false);
                self.saved(true);

                self.savedGuide = JSON.parse(JSON.stringify(data.guide));

                _.delay(function() {
                    self.saved(false);
                }, 15000);
            } else {
                m.route('/guide/edit/' + data.guide.id + '-' + slug(data.guide.title));
            }
        }, function(data) {
            if (data.error) {
                skeleton.errors().push(data.error);
            } else if (data.field_errors) {
                self.fieldErrors = data.field_errors;
            }
            self.saving(false);
        });
    },
    addSection: function(self) {
        self.body.push({
            title: m.prop(''),
            text: m.prop(''),
            image: m.prop(0)
        });
    },
    delSection: function(self, idx) {
        if (idx < self.body.length) {
            self.body.splice(idx, 1);
        }
    },
    hasTag: function(tag) {
        return (_.findWhere(this.guide.tags, { id: tag.id }) !== undefined);
    },
    addTag: function(tag) {
        if (!this.hasTag(tag)) {
            this.guide.tags.push(tag);
        }
    },
    removeTag: function(tag) {
        this.guide.tags = _.filter(this.guide.tags, function(t) { return t.id != tag.id; });
    }
};

module.exports = vm;
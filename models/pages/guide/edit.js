var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var prop = require('util/prop.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var skeleton = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.guide = null;
    this.body = [];
    this.tags = [];
    this.error = null;
    this.saving = m.prop(false);
    this.saved = m.prop(false);
    this.ratings = null;
    this.fieldErrors = {};

    this.addingSuggestion = false;
    this.suggestionError = null;
    this.suggestionUrl = prop('', function(v) { this.suggestionError = null;}.bind(this));

    this.maxSections = 7;
    this.sectionLength = 200;
    this.titleLength = 80;

    this.savedGuide = {
        category_id: 0,
        image_id: 0,
        status: 0,
        title: '',
        source_url: '',
        source_title: '',
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

        title(this, 'New Guide');

        this.guide = {
            category_id: catg,
            category_name: '',
            image_id: 0,
            status: m.prop(0),
            title: m.prop(''),
            source_url: m.prop(''),
            source_title: m.prop(''),
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
            title(this, 'Editing ' + this.guide.title);

            this.body = JSON.parse(this.guide.body);

            this.savedGuide = JSON.parse(JSON.stringify(data.guide));

            this.guide.status = m.prop(this.guide.status);
            this.guide.title = m.prop(this.guide.title);
            this.guide.source_url = m.prop(this.guide.source_url);
            this.guide.source_title = m.prop(this.guide.source_title);

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

            if (!done && auth.key()) {
                req({
                    endpoint: '/rateguide/' + this.guide.id
                }).then(_.bind(function(data) {
                    this.ratings = data.ratings;
                }, this));
            }
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
        if (this.created) {
            return false;
        }

        if (this.guide.id != this.savedGuide.id ||
            this.guide.category_id != this.savedGuide.category_id ||
            this.guide.image_id != this.savedGuide.image_id ||
            this.guide.status() != this.savedGuide.status ||
            this.guide.title() != this.savedGuide.title ||
            this.guide.source_url() != this.savedGuide.source_url ||
            this.guide.source_title() != this.savedGuide.source_title) {
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
    publish: function(self) {
        if (self.saving()) {
            return;
        }

        self.guide.status(1);
        self.save(self);
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
            source_url: self.guide.source_url(),
            source_title: self.guide.source_title(),
            tags: _.pluck(self.guide.tags, 'id'),
            suggestions: self.guide.suggestions ? _.pluck(self.guide.suggestions, 'id') : []
        };

        req({
            method: self.guide.id ? 'PUT' : 'POST',
            endpoint: self.guide.id ? '/guide/' + self.guide.id : '/guide',
            data: data
        }).then(function(data) {
            self.fieldErrors = {};
            self.savedGuide = JSON.parse(JSON.stringify(data.guide));

            if (self.guide.id) {
                self.saving(false);
                self.saved(true);

                _.delay(function() {
                    self.saved(false);
                }, 15000);
            } else {
                self.created = true;

                m.route('/guide/edit/' + data.guide.id + '-' + slug(data.guide.title));
            }
        }, function(data) {
            if (data.error) {
                $(window).scrollTop(0);
                skeleton.errors().push(data.error);
            } else if (data.field_errors) {
                self.fieldErrors = data.field_errors;
            }
            self.saving(false);
        });
    },
    addSection: function(self) {
        if (self.body.length >= self.maxSections) {
            return;
        }

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
    },
    hasSuggestion: function(guideId) {
        return (_.findWhere(this.guide.suggestions, { id: guideId }) !== undefined);
    },
    addSuggestion: function(e) {
        if (e) e.preventDefault();

        this.suggestionError = '';
        if (this.addingSuggestion) {
            return;
        }

        if (!this.suggestionUrl()) {
            this.suggestionError = 'No guide URL given.';
            return;
        }

        var match = this.suggestionUrl().match(/\/guide\/(?:\S+\/)?(\d+)/);
        if (!match) {
            this.suggestionError = 'Invalid guide URL.';
            return;
        }

        var guideId = match[1];

        if (this.hasSuggestion(guideId)) {
            this.suggestionError = 'Guide has already been added.';
            return;
        } else if (this.guide.id == guideId) {
            this.suggestionError = 'You can\'t suggest this guide for this guide.';
            return;
        }

        this.addingSuggestion = true;

        req({
            endpoint: '/guide/' + guideId
        }, true).then(function(data) {
            this.addingSuggestion = false;
            this.guide.suggestions.push(data.guide);
        }.bind(this), function(data) {
            this.addingSuggestion = false;
            this.suggestionError = data.error;
        }.bind(this));
    },
    removeSuggestion: function(guide) {
        this.guide.suggestions = _.filter(this.guide.suggestions, function(t) { return t.id != guide.id; });
    }
};

module.exports = vm;
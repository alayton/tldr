var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var skeleton = require('../../../views/layout/skeleton.js');

var vm = function(params, done) {
    this.guide = null;
    this.body = null;
    this.error = null;
    this.saving = m.prop(false);
    this.saved = m.prop(false);

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

        this.guide.title = m.prop(this.guide.title);

        _.each(this.body, function(s) {
            s.title = m.prop(s.title || '');
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
        this.guide = false;
        this.error = data.error;
        if (done) done(null, this);
    }, this));
};

vm.prototype = {
    save: function(self) {
        if (self.saving()) {
            return;
        }

        self.saving(true);
        var body = [];
        _.each(self.body, function(s) {
            body.push({
                title: s.title(),
                text: s.text(),
                image: s.image()
            });
        });

        var data = {
            category: self.guide.category_id,
            title: self.guide.title(),
            body: JSON.stringify(body),
            tags: _.pluck(self.guide.tags, 'id'),
            suggestions: self.guide.suggestions ? _.pluck(self.guide.suggestions, 'id') : []
        };

        req({
            method: 'PUT',
            endpoint: '/guide/' + self.guide.id,
            data: data
        }).then(function(data) {
            self.saving(false);
            self.saved(true);
            _.delay(function() {
                self.saved(false);
            }, 15000);
        }, function(data) {
            skeleton.errors().push(data.error);
            self.saving(false);
        });
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
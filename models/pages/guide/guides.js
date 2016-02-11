var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var param = require('../../../util/param.js');
var req = require('../../../util/request.js');
var layout = require('../../../views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = null;
    this.tags = null;
    this.category = null;
    this.childTags = null;

    var tagIds = [],
        catgId = parseInt(param(params, 'catg', 0)),
        tags = param(params, 'tags', '').split(','),
        promises = [];

    if (!catgId) {
        m.route('/');
        layout.errors().push('No category given for guide list :(');
    }

    _.each(tags, function(t) {
        var id = parseInt(t);
        if (!isNaN(id)) {
            tagIds.push(id);
        }
    });

    if (tagIds.length == 0) {
        this.guides = [];
        this.tags = [];
    } else {
        promises.push(
            req({
                endpoint: '/tag/list/' + tagIds.join(',')
            }, true).then(_.bind(function(data) {
                this.tags = data.tags;
            }, this))
        );
    }

    promises.push(
        req({
            endpoint: '/guide?catg=' + catgId + '&tags=' + tagIds.join(',')
        }, true).then(_.bind(function(data) {
            this.guides = data.guides;
        }, this))
    );

    promises.push(
        req({
            endpoint: '/tag/children/' + catgId
        }, true).then(_.bind(function(data) {
            this.category = data.tag;
            this.childTags = data.children;
        }, this))
    );

    m.sync(promises).then(_.bind(function() {
        if (done) done(null, this);
    }, this));
};

vm.prototype = {
    addTag: function(tag) {
        return this._buildUrl(tag, null);
    },
    removeTag: function(tag) {
        return this._buildUrl(null, tag);
    },
    hasTag: function(tag) {
        return _.findWhere(this.tags, { id: tag.id }) !== undefined;
    },
    _buildUrl: function(toAdd, toRemove) {
        var url = '/guides/' + this.category.id + '-' + slug(this.category.name);
        toAdd = toAdd || { id: 0 };
        toRemove = toRemove || { id: 0 };

        var self = this,
            tags = [],
            newTag = true;
        _.each(self.tags, function(t) {
            if (self.category.id == t.id || toRemove.id == t.id) {
                return;
            } else if (toAdd.id == t.id) {
                newTag = false;
            }

            tags.push(t.id + '-' + slug(t.name));
        });

        if (newTag && toAdd.id > 0) {
            tags.push(toAdd.id + '-' + slug(toAdd.name));
        }

        if (tags.length > 0) {
            url += '/' + tags.join(',');
        }

        return url;
    }
};

module.exports = vm;
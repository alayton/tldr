var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var imageurl = require('util/imageurl.js');
var title = require('util/page/title.js');
var ogImage = require('util/page/og-image.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.guides = null;
    this.tags = null;
    this.category = null;
    this.childTags = null;
    this.ratings = null;

    var tagIds = [],
        catgId = parseInt(param(params, 'catg', 0)),
        tags = param(params, 'tags', '').split(','),
        page = param(params, 'page', 1),
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
            }, this).then(_.bind(function(data) {
                this.tags = data.tags;
            }, this))
        );
    }

    promises.push(
        req({
            endpoint: '/guide?catg=' + catgId + '&tags=' + tagIds.join(',') + '&page=' + page
        }, this).then(_.bind(function(data) {
            this.guides = data.guides;
            this.pagination = {
                page: data.page,
                total_results: data.total_results,
                results_per_page: data.results_per_page
            };

            if (auth.key()) {
                var ids = _.pluck(this.guides, 'id');
                if (ids && ids.length > 0) {
                    req({
                        endpoint: '/rateguide/' + ids.join(',')
                    }).then(_.bind(function(data) {
                        this.ratings = data.ratings;
                    }, this));
                }
            }
        }, this))
    );

    promises.push(
        req({
            endpoint: '/tag/children/' + catgId
        }, this).then(_.bind(function(data) {
            this.category = data.tag;
            this.childTags = data.children;

            title(this, this.category.name + ' Guides');
            if (this.category.image_id) {
                ogImage(this, imageurl(this.category.image_id));
            }
        }, this))
    );

    m.sync(promises).then(_.bind(function() {
        if (done) done(null, this);
    }, this));
};

vm.prototype = {
    addTag: function(tag) {
        return this.buildUrl(tag, null);
    },
    removeTag: function(tag) {
        return this.buildUrl(null, tag);
    },
    hasTag: function(tag) {
        return _.findWhere(this.tags, { id: tag.id }) !== undefined;
    },
    buildUrl: function(toAdd, toRemove) {
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
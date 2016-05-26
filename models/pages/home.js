var m = require('mithril');
var _ = require('underscore');
var Sifter = require('sifter');
var auth = require('models/auth.js');
var title = require('util/page/title.js');
var req = require('util/request.js');

var vm = function(params, done) {
    this.tags = null;
    this.topTags = null;
    this.shownTags = [];
    this.tagSearch = '';
    this.moreTags = false;

    this.guides = null;

    this.sifter = null;

    title(this);

    var promises = [];

    promises.push(req({
        endpoint: '/tag/top/1'
    }, this).then(function(data) {
        this.tags = data.tags;
        this.topTags = data.tags.slice(0, 8);

        this.shownTags = [].concat(this.topTags);
        this.moreTags = this.shownTags.length < this.tags.length;

        this.sifter = new Sifter(this.tags);
    }.bind(this)));

    promises.push(req({
        endpoint: '/hot/guides'
    }, this).then(function(data) {
        this.guides = data.guides.slice(0, 5);

        if (auth.key()) {
            var ids = _.pluck(this.guides, 'id');
            if (ids && ids.length > 0) {
                req({
                    endpoint: '/rateguide/' + ids.join(',')
                }).then(function(data) {
                    this.ratings = data.ratings;
                }.bind(this));
            }
        }
    }.bind(this)));

    m.sync(promises).then(function() {
        if (done) done(null, this);
    }.bind(this));
};

vm.prototype = {
    showMore: function(e) {
        if (e) e.preventDefault();
        if (!this.tags || !this.shownTags) return;

        if (this.shownTags.length < this.tags.length) {
            this.shownTags = this.shownTags.concat(this.tags.slice(this.shownTags.length, this.shownTags.length + 8));
        }

        this.moreTags = this.shownTags.length < this.tags.length;
    },
    search: function(str) {
        this.tagSearch = str || '';

        if (this.tagSearch.length == 0) {
            this.shownTags = [].concat(this.topTags);
        } else {
            var result = this.sifter.search(this.tagSearch, {
                fields: ['name'],
                sort: [{ field: 'name', direction: 'asc' }]
            });

            var filtered = [], tags = this.tags;
            _.each(result.items, function(r) {
                filtered.push(tags[r.id]);
            });
            this.shownTags = filtered;
        }
    }
};

module.exports = vm;
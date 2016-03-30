var _ = require('underscore');
var slug = require('slug');

module.exports = function(guide) {
    var title = (_.isFunction(guide.title) ? guide.title() : guide.title);
    return ['/guide/', slug(guide.category_name), '/', guide.id, '-', slug(title)].join('');
};
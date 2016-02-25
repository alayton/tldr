var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var layout = require('../layout/sidebar.js');
var tagCard = require('../components/tag/tag.js');

module.exports = function(vm) {
    return layout([
        m('h2', 'Categories'),
        m('.card-deck', _.map(vm.tags, tagCard))
    ]);
};
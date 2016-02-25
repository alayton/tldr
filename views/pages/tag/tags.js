var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');
var tagCard = require('../../components/tag/tag.js');

module.exports = function(vm) {
    return layout([
        m('.card-deck', _.map(vm.tags, tagCard))
    ]);
};
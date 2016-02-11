var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var layout = require('../layout/sidebar.js');

module.exports = function(vm) {
    return layout([
        m('img.center-block', { src: '/asset/img/404-cat.png' })
    ]);
};
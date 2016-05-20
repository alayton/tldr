var m = require('mithril');
var supports = require('util/supports.js');
var skeleton = require('views/layout/skeleton.js');
var sidebar = require('controllers/components/sidebar.js');

var layout = function(content, contentClass) {
    var collapsed = supports.localStorage() ? JSON.parse(localStorage.getItem('collapse-sidebar')) : false;

    return skeleton([
        m('.content', content),
        collapsed ? [] : m.component(sidebar)
    ], contentClass);
};

layout.errors = skeleton.errors;
layout.notices = skeleton.notices;

module.exports = layout;
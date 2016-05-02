var m = require('mithril');
var supports = require('util/supports.js');
var skeleton = require('views/layout/skeleton.js');
var sidebar = require('controllers/components/sidebar.js');

var layout = function(content, contentClass) {
    var collapsed = supports.localStorage() ? JSON.parse(localStorage.getItem('collapse-sidebar')) : false;

    return skeleton(m('.row', [
        m('.col-xs-12.col-sm-12' + (collapsed ? '.col-md-12' : '.col-lg-9'), content),
        m(collapsed ? '.hidden-xs-up' : '.col-xs-12.col-sm-12.col-md-12.col-lg-3', m.component(sidebar))
    ]), contentClass);
};

layout.errors = skeleton.errors;
layout.notices = skeleton.notices;

module.exports = layout;
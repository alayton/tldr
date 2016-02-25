var m = require('mithril');
var skeleton = require('./skeleton.js');
var sidebar = require('../components/sidebar.js');

var layout = function(content) {
    return skeleton(m('.row', [
        m('.col-sm-9.col-md-10', content),
        m('.col-sm-3.col-md-2', sidebar())
    ]));
};

layout.errors = skeleton.errors;
layout.notices = skeleton.notices;

module.exports = layout;
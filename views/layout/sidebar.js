var m = require('mithril');
var skeleton = require('./skeleton.js');
var sidebar = require('../components/sidebar.js');

var layout = function(content, contentClass) {
    return skeleton(m('.row', [
        m('.col-sm-12.col-md-12', content)
        //m('.col-sm-3.col-md-2', sidebar())
    ]), contentClass);
};

layout.errors = skeleton.errors;
layout.notices = skeleton.notices;

module.exports = layout;
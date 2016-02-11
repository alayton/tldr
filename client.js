var m = require('mithril');
var $ = require('jquery');
var routes = require('./routes.js');

m.route.mode = 'pathname';

$(function() {
    m.route(document.body, '/404', routes);

    window['tldrRequests'] = undefined;
});
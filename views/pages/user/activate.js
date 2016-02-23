var m = require('mithril');
var layout = require('../../layout/sidebar.js');

module.exports = function(vm) {
    return layout(
        m('.page-loading', [
            m('h2', m.trust('Loading &hellip;')),
            m('i.fa.fa-spinner.fa-pulse')
        ])
    );
};
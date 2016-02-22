var m = require('mithril');
var auth = require('../../models/auth.js');

module.exports = function() {
    return [
        m('h2', 'Whats up?'),
        auth.user() ?
            [
                m('p', 'Recent activity goes here...')
            ] :
            [
                m('p', 'Log in to see your recent activity!')
            ]
    ];
};
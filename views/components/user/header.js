var m = require('mithril');
var slug = require('slug');
var auth = require('models/auth.js');

module.exports = function(user, tab) {
    var userSlug = slug(user.username),
        title = {
            settings: "'s Account Settings",
            guides: "'s Guides",
            comments: "'s Comments",
            images: "'s Images"
        }[tab];

    return [
        m('.category-header', [
            m('h1', [user.username, title])
        ]),
        m('ul.nav.nav-pills', [
            (auth.user() && (auth.user().id == user.id || auth.isManager())) ?
                m('li.nav-item', m('a.nav-link', {
                    className: (tab == 'settings' ? 'active' : ''),
                    config: m.route,
                    href: '/user/' + user.id + '-' + userSlug
                }, 'Settings')) :
                [],
            m('li.nav-item', m('a.nav-link', {
                className: (tab == 'guides' ? 'active' : ''),
                config: m.route,
                href: '/user/guides/' + user.id + '-' + userSlug
            }, 'Guides')),
            m('li.nav-item', m('a.nav-link', {
                className: (tab == 'comments' ? 'active' : ''),
                config: m.route,
                href: '/user/comments/' + user.id + '-' + userSlug
            }, 'Comments')),
            (auth.user() && (auth.user().id == user.id || auth.isPrivileged())) ?
                m('li.nav-item', m('a.nav-link', {
                    className: (tab == 'images' ? 'active' : ''),
                    config: m.route,
                    href: '/user/images/' + user.id + '-' + userSlug
                }, 'Images')) :
                []
        ])
    ];
};
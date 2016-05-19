var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var slug = require('slug');
var moment = require('moment');
var supports = require('util/supports.js');
var auth = require('models/auth.js');

global.jQuery = require('jquery');

if (typeof window !== 'undefined') {
    require('autotrack');
    window.Tether = require('tether');
    require('bootstrap');
    require('asset/js/rangyinputs-jquery.js');
}

var search = function(e) {
    e.preventDefault();

    m.route('/search?q=' + encodeURIComponent(layout.search()));

    return false;
};

var showLogin = function() {
    $('#loginModal').modal('show');
};

var showSignup = function() {
    $('#signupModal').modal('show');
};

var showRename = function() {
    $('#renameModal').modal('show');
};

var toggleSidebar = function(e) {
    if (!supports.localStorage()) return;

    var collapsed = JSON.parse(localStorage.getItem('collapse-sidebar')) || false;

    localStorage.setItem('collapse-sidebar', JSON.stringify(!collapsed));
    localStorage.setItem('sidebar-activity', JSON.stringify({ count: 0, last: moment().format() }));
};

var layout = function(content, contentClass) {
    var login = require('controllers/components/user/login.js');
    var signup = require('controllers/components/user/signup.js');
    var rename = require('controllers/components/user/rename.js');
    var collapsed = supports.localStorage() ? JSON.parse(localStorage.getItem('collapse-sidebar')) : false,
        activity = supports.localStorage() ? JSON.parse(localStorage.getItem('sidebar-activity')) : null;

    if (!activity) activity = { count: 0 };
    if (auth.user() && !auth.user().username) _.defer(showRename);

    return  m('.wrapper', [
                m('.tldr-logo', [
                    m('a[href=/]')
                ]),
                m('.topbar', [
                    m('.container', [
                        m('a.fa.fa-twitter[href=https://www.twitter.com/tldrplease]'),
                        m('a.fa.fa-facebook-square[href=https://www.facebook.com/tldrplease]')
                    ])
                ]),
                m('nav.navbar.navbar-full.navbar-dark.nav-bg', [
                    m('.container.search-box', [
                        m('form.form-inline.pull-xs-left', {
                            onsubmit: search
                        }, [
                            m('input.form-control[type=text]', { placeholder: 'Search...', oninput: m.withAttr('value', layout.search), value: layout.search() }),
                            m('i.fa.fa-search')
                        ])
                    ]),
                    m('label.show-menu', { for: 'show-menu' }, [m('i.fa.fa-bars')]),
                    m('input.menu-control[type=checkbox]#show-menu', { role: 'button' }),
                    m('.container#mobile-menu', [
                        m('a.sidebar-alert.pull-xs-right.hidden-md-down[href=javascript:;]', {
                            className: (collapsed ? '' : 'open'),
                            onclick: toggleSidebar
                        }, [
                            m('i.fa.fa-bell-o.fa-fw'),
                            collapsed ? m('span.label.label-pill.label-primary', activity.count) : []
                        ]),
                        m('ul.nav.navbar-nav.pull-xs-right', [
                            auth.user() ?
                                m('li.nav-item.dropdown', [
                                    m('a.nav-link.dropdown-toggle[href=javascript:;]', {
                                        'data-toggle': 'dropdown',
                                        onclick: function() { $(this).dropdown(); }
                                    }, auth.user().username ? auth.user().username : '[Unnamed]'),
                                    m('.dropdown-menu.dropdown-menu-right', [
                                        m('a.dropdown-item', { config: m.route, href: '/user' }, 'Account settings'),
                                        m('a.dropdown-item', { config: m.route, href: '/user/guides/' + auth.user().id + '-' + slug(auth.user().username) }, 'My guides'),
                                        auth.isPrivileged() ? m('a.dropdown-item[href=/recent/guides]', { config: m.route }, 'Recent guides') : [],
                                        m('a.dropdown-item[href=javascript:;]', { onclick: function() { auth.logout(); } }, 'Log out')
                                    ])
                                ]) :
                                [
                                    m('li.nav-item', m('a.nav-link[href=javascript:;]', { onclick: showLogin }, 'Log in')),
                                    m('li.nav-item', m('a.btn.btn-signup[href=javascript:;]', { onclick: showSignup }, 'Sign up'))
                                ]
                        ])
                    ])
                ]),
                m('.container', { className: (contentClass ? contentClass : '') }, [
                    _.map(layout.errors(), function(err) {
                        return m('.alert.alert-warning.alert-dismissable.fade.in', [
                            m('button.close[type=button]', { 'data-dismiss': 'alert' }, m('span', m.trust('&times;'))),
                            err
                        ]);
                    }),
                    _.map(layout.notices(), function(err) {
                        return m('.alert.alert-info.alert-dismissable.fade.in', [
                            m('button.close[type=button]', { 'data-dismiss': 'alert' }, m('span', m.trust('&times;'))),
                            err
                        ]);
                    }),
                    content
                ]),
                m('footer.footer', [
                    m('.container', [
                        m('span.copyright', '© TLDR.gg ' + new Date().getFullYear()),
                        m('ul', [
                            m('li', [
                                m('a[href=mailto:coolpeople@tldr.gg]', 'Contact')
                            ]),
                            m('li.divider', ' - '),
                            m('li', [
                                 m('a[href=/about]', 'About')
                            ]),
                            m('li.divider', ' - '),
                            m('li', [
                                 m('a[href=/privacy]', 'Privacy')
                            ]),
                            m('li.divider', ' - '),
                            m('li', [
                                 m('a[href=/tos]', 'TOS')
                            ])
                        ])
                    ])
                ]),
                m.component(login),
                m.component(signup),
                auth.user() && !auth.user().username ? m.component(rename) : []
            ]);
};

layout.notices = m.prop([]);
layout.errors = m.prop([]);

layout.search = m.prop('');

module.exports = layout;
var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var auth = require('../../models/auth.js');

global.jQuery = require('jquery');

if (typeof window !== 'undefined') {
    window.Tether = require('tether');
    require('bootstrap');
    require('../../asset/js/rangyinputs-jquery.js');
}

var search = function(e) {
    e.preventDefault();
};

var showLogin = function() {
    $('#loginModal').modal('show');
};

var layout = function(content) {
    var login = require('../../controllers/components/login.js');

    return m('.container', [
        m('nav.navbar.navbar-full.navbar-dark.bg-primary', [
            m('a.navbar-brand[href=/]', 'TLDR.gg'),
            m('form.form-inline.pull-xs-left', [
                m('input.form-control[type=text]', { placeholder: 'Search' }),
                m('button.btn.btn-info-outline', { onclick: search }, 'Search')
            ]),
            m('ul.nav.navbar-nav.pull-xs-right', [
                auth.user() ?
                    m('li.nav-item.dropdown', [
                        m('a.nav-link.dropdown-toggle[href=javascript:;]', { 'data-toggle': 'dropdown', onclick: function() { $(this).dropdown(); } }, auth.user().username),
                        m('.dropdown-menu.dropdown-menu-right', [
                            m('a.dropdown-item[href=javascript:;]', { onclick: function() { auth.logout(); } }, 'Log out')
                        ])
                    ]) :
                    [
                        m('li.nav-item', m('a.nav-link[href=javascript:;]', { onclick: showLogin }, 'Log in')),
                        m('li.nav-item', m('a.nav-link[href=/signup]', 'Sign up'))
                    ]
            ])
        ]),
        _.map(layout.errors(), function(err) {
            return m('.alert.alert-warning.alert-dismissable.fade.in', [
                m('button.close[type=button]', { 'data-dismiss': 'alert' }, m('span', m.trust('&times;'))),
                err
            ]);
        }),
        content,
        m('footer.footer', m('p', '© TLDR.gg ' + new Date().getFullYear())),
        m.component(login)
    ]);
};

layout.errors = m.prop([]);

module.exports = layout;
var m = require('mithril');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');

module.exports = function(vm) {
    if (!auth.user()) {
        return layout([
            m('.loading-container', m('i.loading.fa.fa-spinner.fa-pulse.fa-3x.fa-fw'))
        ], 'user-settings');
    } else {
        var isSelf = vm.user.id == auth.user().id;

        return layout([
            m('.category-header', [
                m('h1', isSelf ? 'Account Settings' : 'Managing ' + vm.user.username)
            ]),
            m('ul.nav.nav-pills', [
                (auth.user() && (auth.user().id == vm.user.id || auth.isManager())) ?
                    m('li.nav-item', m('a.nav-link.active', { config: m.route, href: '/user/' + vm.user.id + '-' + slug(vm.user.username) }, 'Settings')) :
                    [],
                m('li.nav-item', m('a.nav-link', { config: m.route, href: '/user/guides/' + vm.user.id + '-' + slug(vm.user.username) }, 'Guides')),
                (auth.user() && (auth.user().id == vm.user.id || auth.isPrivileged())) ?
                    m('li.nav-item', m('a.nav-link', { config: m.route, href: '/user/images/' + vm.user.id + '-' + slug(vm.user.username) }, 'Images')) :
                    []
            ]),
            m('.settings-field', [
                m('h2', 'Change Username'),
                m('form', { onsubmit: vm.updateUsername.bind(vm) }, [
                    vm.usernameError() ? m('p.error', vm.usernameError()) : [],
                    m('.form-group', [
                        m('label', { 'for': 'usernameInput' }, 'New username'),
                        m('input[type=text].form-control', {
                            id: 'usernameInput',
                            placeholder: 'Your new username',
                            value: vm.newUsername(),
                            oninput: m.withAttr('value', vm.newUsername)
                        })
                    ]),
                    m('button[type=submit].btn.btn-primary', 'Change Username')
                ])
            ]),
            m('.settings-field', [
                m('h2', 'Change Password'),
                m('form', { onsubmit: vm.updatePassword.bind(vm) }, [
                    vm.passwordError() ? m('p.error', vm.passwordError()) : [],
                    m('.form-group', [
                        m('label', { 'for': 'passwordInput' }, 'Current password'),
                        m('input[type=password].form-control', {
                            id: 'passwordInput',
                            placeholder: 'Your current password',
                            value: vm.password(),
                            oninput: m.withAttr('value', vm.password)
                        }),
                        m('small.text-muted', 'Leave this blank if you\'ve never set a password (e.g. you signed up using Google or Facebook)')
                    ]),
                    m('.form-group', [
                        m('label', { 'for': 'newPasswordInput' }, 'New password'),
                        m('input[type=password].form-control', {
                            id: 'newPasswordInput',
                            placeholder: 'Your new password',
                            value: vm.newPassword(),
                            oninput: m.withAttr('value', vm.newPassword)
                        })
                    ]),
                    m('.form-group', [
                        m('label', { 'for': 'confirmPasswordInput' }, 'Confirm password'),
                        m('input[type=password].form-control', {
                            id: 'confirmPasswordInput',
                            placeholder: 'Confirm your new password',
                            value: vm.confirmPassword(),
                            oninput: m.withAttr('value', vm.confirmPassword)
                        })
                    ]),
                    m('button[type=submit].btn.btn-primary', 'Change Password')
                ])
            ]),
            /*m('.settings-field', [
                m('h2', 'Change Email Address'),
                m('form', { onsubmit: vm.updateEmail.bind(vm) }, [
                    vm.emailError() ? m('p.error', vm.emailError()) : [],
                    m('.form-group', [
                        m('label', 'Current email address'),
                        m('input[type=text].form-control', { value: vm.user.email, readonly: true })
                    ]),
                    m('.form-group', [
                        m('label', { 'for': 'newEmailInput' }, 'New email address'),
                        m('input[type=email].form-control', {
                            id: 'newEmailInput',
                            placeholder: 'Your new email address',
                            value: vm.newEmail(),
                            oninput: m.withAttr('value', vm.newEmail)
                        })
                    ]),
                    m('.form-group', [
                        m('label', { 'for': 'confirmEmailInput' }, 'Confirm email address'),
                        m('input[type=email].form-control', {
                            id: 'confirmEmailInput',
                            placeholder: 'Confirm your new email address',
                            value: vm.confirmEmail(),
                            oninput: m.withAttr('value', vm.confirmEmail)
                        })
                    ]),
                    m('button[type=submit].btn.btn-primary', 'Change Email')
                ])
            ]),*/
            auth.isManager() ? m('.settings-field', [
                m('h2', 'Change Roles'),
                m('form', { onsubmit: vm.updateRoles.bind(vm) }, [
                    vm.rolesError() ? m('p.error', vm.rolesError()) : [],
                    m('.checkbox-inline', m('label', [
                        m('input[type=checkbox]', { checked: vm.roleVerified(), onclick: m.withAttr('checked', vm.roleVerified) }),
                        ' Verified'
                    ])),
                    m('.checkbox-inline', m('label', [
                        m('input[type=checkbox]', { checked: vm.roleExecutive(), onclick: m.withAttr('checked', vm.roleExecutive) }),
                        ' Executive'
                    ])),
                    m('.checkbox-inline', m('label', [
                        m('input[type=checkbox]', { checked: vm.roleAdmin(), onclick: m.withAttr('checked', vm.roleAdmin) }),
                        ' Administrator'
                    ])),
                    m('.checkbox-inline', m('label', [
                        m('input[type=checkbox]', { checked: vm.roleModerator(), onclick: m.withAttr('checked', vm.roleModerator) }),
                        ' Moderator'
                    ])),
                    m('button[type=submit].btn.btn-primary', 'Set Roles')
                ])
            ]) : []
        ], 'user-settings');
    }
};
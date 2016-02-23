var m = require('mithril');
var _ = require('underscore');
var layout = require('../../layout/skeleton.js');
var auth = require('../../../models/auth.js');

module.exports = function(vm) {
    return m('#signupModal.modal.fade', m('.modal-dialog', m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: vm.closeModal }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Log in to TLDR.gg')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', { className: vm.emailError() ? 'has-danger' : '' }, [
                m('label[for=signup-email]', 'Email'),
                m('input.form-control#signup-email', { type: 'email', onchange: m.withAttr('value', vm.email), onblur: _.bind(vm.validate, vm), value: vm.email() }),
                vm.emailError() ? m('small', vm.emailError()) : null
            ]),
            m('fieldset.form-group', { className: vm.usernameError() ? 'has-danger' : '' }, [
                m('label[for=signup-username]', 'Username'),
                m('input.form-control#signup-username', { type: 'text', onchange: m.withAttr('value', vm.username), onblur: _.bind(vm.validate, vm), value: vm.username() }),
                vm.usernameError() ? m('small', vm.usernameError()) : null
            ]),
            m('fieldset.form-group', { className: vm.passwordError() ? 'has-danger' : '' }, [
                m('label[for=signup-password]', 'Password'),
                m('input.form-control#signup-password', { type: 'password', onchange: m.withAttr('value', vm.password), onblur: _.bind(vm.validate, vm), value: vm.password() }),
                vm.passwordError() ? m('small', vm.passwordError()) : null
            ]),
            m('fieldset.form-group', { className: vm.confirmError() ? 'has-danger' : '' }, [
                m('label[for=signup-confirm]', 'Confirm'),
                m('input.form-control#signup-confirm', { type: 'password', onchange: m.withAttr('value', vm.confirmPassword), onblur: _.bind(vm.validate, vm), value: vm.confirmPassword() }),
                vm.confirmError() ? m('small', vm.confirmError()) : null
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-secondary', { onclick: vm.closeModal }, 'Close'),
            m('button.btn.btn-primary', { onclick: function(e) { vm.submit(e); } }, 'Sign up')
        ])
    ])))
};
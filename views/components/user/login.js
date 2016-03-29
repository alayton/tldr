var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../layout/skeleton.js');
var auth = require('../../../models/auth.js');

var showSignup = function() {
    $('#loginModal').modal('hide');
    $('#signupModal').modal('show');
};

module.exports = function(vm) {
    return m('#loginModal.modal.fade', m('.modal-dialog', m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: vm.closeModal }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Log in to TLDR.gg')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', { className: vm.emailError() ? 'has-danger' : '' }, [
                m('label[for=email]', 'Email'),
                m('input.form-control', { type: 'email', onchange: m.withAttr('value', vm.email), value: vm.email() }),
                vm.emailError() ? m('small', vm.emailError()) : null
            ]),
            m('fieldset.form-group', { className: vm.passwordError() ? 'has-danger' : '' }, [
                m('label[for=password]', 'Password'),
                m('input.form-control', { type: 'password', onchange: m.withAttr('value', vm.password), value: vm.password() }),
                vm.passwordError() ? m('small', vm.passwordError()) : null
            ])
        ]),
        m('.modal-footer', [
            m('.pull-left', [
                'Don\'t have an account? ',
                m('a[href=javascript:;]', { onclick: showSignup }, 'Sign up')
            ]),
            m('button.btn.btn-secondary', { onclick: vm.closeModal }, 'Close'),
            m('button.btn.btn-primary', { onclick: function(e) { vm.submit(e); } }, 'Log in')
        ])
    ])))
};
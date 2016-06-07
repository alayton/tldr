var m = require('mithril');
var _ = require('underscore');
var modal = require('util/modal.js');
var req = require('util/request.js');
var auth = require('models/auth.js');
var layout = require('views/layout/skeleton.js');
var socialauth = require('views/components/user/socialauth.js');

var showSignup = function() {
    var signup = require('views/modals/signup.js');
    modal.show(signup);
};

var close = function() {
    modal.hide();
};

var model = function() {
    this.email = m.prop('');
    this.password = m.prop('');

    this.error = m.prop(null);
    this.emailError = m.prop(null);
    this.passwordError = m.prop(null);
};

model.prototype = {
    serialize: function() {
        return {
            email: this.email(),
            password: this.password()
        };
    },
    submit: function(e) {
        e.preventDefault();
        var self = this;
        self.error(null);

        req({
            endpoint: '/auth',
            method: 'POST',
            data: this.serialize()
        }, true).then(function(data) {
            if (data.ok && data.token) {
                auth.key(data.token);
                auth.user(data.user);

                close();
            } else if (data.error) {
                layout.errors().push(data.error);
            } else {
                layout.errors().push('An error occurred.');
            }
        }, function(err) {
            if (err.field_errors) {
                if (err.field_errors.Email) {
                    self.emailError(err.field_errors.Email);
                }
                if (err.field_errors.Password) {
                    self.passwordError(err.field_errors.Password);
                }
            }

            if (err.error) {
                self.error(err.error);
            }
        });

        return false;
    }
};

var view = function(vm) {
    return m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: close }, m('span', m.trust('&times;'))),
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
        m('.modal-footer', socialauth),
        m('.modal-footer', [
            m('.pull-left', [
                'Don\'t have an account? ',
                m('a[href=javascript:;]', { onclick: showSignup }, 'Sign up')
            ]),
            m('button.btn.btn-secondary[type=button]', { onclick: close }, 'Close'),
            m('button.btn.btn-primary[type=submit]', 'Log in')
        ])
    ]);
};

module.exports = modal(model, view);
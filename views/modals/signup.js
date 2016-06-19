var m = require('mithril');
var _ = require('underscore');
var auth = require('models/auth.js');
var modal = require('util/modal.js');
var layout = require('views/layout/skeleton.js');
var socialauth = require('views/components/user/socialauth.js');

var showLogin = function() {
    var login = require('views/modals/login.js');
    modal.show(login);
};

var close = function() {
    modal.hide();
};

var model = function() {
    this.email = m.prop('');
    this.username = m.prop('');
    this.password = m.prop('');
    this.confirmPassword = m.prop('');

    this.error = m.prop(null);
    this.emailError = m.prop(null);
    this.usernameError = m.prop(null);
    this.passwordError = m.prop(null);
    this.confirmError = m.prop(null);
};

model.prototype = {
    validate: function() {
        var username = this.username(),
            password = this.password(),
            confirm = this.confirmPassword(),
            result = true;

        if (username.length < 3 || username.length > 20) {
            result = false;
            this.usernameError('Username must be 3-20 characters long.');
        } else {
            this.usernameError(null);
        }

        if (password.length < 8) {
            result = false;
            this.passwordError('Password must be at least 8 characters long.');
        } else if (password.length > 70) {
            result = false;
            this.passwordError('Long passwords are awesome, but must be 70 characters or less.');
        } else if (password != confirm) {
            result = false;
            this.passwordError(null);
            this.confirmError('Both passwords must match.');
        } else {
            this.passwordError(null);
            this.confirmError(null);
        }

        return result;
    },
    serialize: function() {
        return {
            email: this.email(),
            username: this.username(),
            password: this.password()
        };
    },
    submit: function(e) {
        e.preventDefault();
        var self = this;
        self.error(null);

        if (!self.validate()) {
            return false;
        }

        req({
            endpoint: '/user',
            method: 'POST',
            data: this.serialize()
        }, true).then(function(data) {
            if (data.ok) {
                modal.hide();
                layout.notices().push('Success! We just sent you an email with a link to activate your account.');
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
                if (err.field_errors.Username) {
                    self.usernameError(err.field_errors.Username);
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
            m('h4.modal-title', 'Sign up for TLDR.gg')
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
        m('.modal-footer', socialauth),
        m('.modal-footer', [
            m('.pull-left', [
                'Already have an account? ',
                m('a[href=javascript:;]', { onclick: showLogin }, 'Log in')
            ]),
            m('button.btn.btn-secondary[type=button]', { onclick: close }, 'Close'),
            m('button.btn.btn-primary[type=submit]', 'Sign up')
        ])
    ]);
};

module.exports = modal(model, view);
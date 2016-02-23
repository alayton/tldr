var m = require('mithril');
var $ = require('jquery');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var req = require('../../../util/request.js');

var vm = function() {
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

vm.prototype = {
    closeModal: function() {
        $('#signupModal').modal('hide');
    },
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
                self.closeModal();
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

module.exports = vm;
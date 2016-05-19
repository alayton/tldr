var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var layout = require('views/layout/skeleton.js');

var vm = function(params, done) {
    this.user = null;

    this.newEmail = m.prop('');
    this.confirmEmail = m.prop('');
    this.newUsername = m.prop('');
    this.password = m.prop('');
    this.newPassword = m.prop('');
    this.confirmPassword = m.prop('');
    this.roleVerified = m.prop(false);
    this.roleExecutive = m.prop(false);
    this.roleAdmin = m.prop(false);
    this.roleModerator = m.prop(false);

    this.emailError = m.prop(null);
    this.usernameError = m.prop(null);
    this.passwordError = m.prop(null);
    this.rolesError = m.prop(null);

    var userId = parseInt(param(params, 'id', 0));

    if (auth.user() && userId == 0) {
        userId = auth.user().id;
    }

    if (done) {
        done(null, this);
    } else if (auth.user() && (auth.user().id == userId || auth.isManager())) {
        req({
            endpoint: '/user/' + userId
        }).then(function(data) {
            this.user = data.user;
            this.roleVerified((this.user.roles & 1) > 0);
            this.roleExecutive((this.user.roles & 2) > 0);
            this.roleAdmin((this.user.roles & 4) > 0);
            this.roleModerator((this.user.roles & 8) > 0);

            title(this, this.user.username);
        }.bind(this));
    } else {
        m.route('/404');
    }
};

vm.prototype = {
    updateUsername: function(e) {
        e.preventDefault();
        this.usernameError(null);

        req({
            endpoint: '/user/' + this.user.id,
            method: 'PUT',
            data: { username: this.newUsername() }
        }).then(function(data) {
            if (data.ok) {
                if (this.user.id == auth.user().id) auth.user(data.user);
                layout.notices().push('Username updated.');
                this.newUsername('');
            } else {
                this.usernameError(data.error ? data.error : 'An error occurred.');
            }
        }.bind(this), function(err) {
            if (err.field_errors && err.field_errors.Username) {
                this.usernameError(err.field_errors.Username);
            } else {
                this.usernameError(err.error ? err.error : 'An error occurred.');
            }
        }.bind(this));
    },
    updatePassword: function(e) {
        e.preventDefault();
        this.passwordError(null);

        if (this.newPassword() != this.confirmPassword()) {
            this.passwordError('New passwords do not match.');
        } else {
            req({
                endpoint: '/user/' + this.user.id,
                method: 'PUT',
                data: { old_password: this.password(), password: this.newPassword() }
            }).then(function(data) {
                if (data.ok) {
                    layout.notices().push('Password updated.');
                    this.password('');
                    this.newPassword('');
                    this.confirmPassword('');
                } else {
                    this.passwordError(data.error ? data.error : 'An error occurred.');
                }
            }.bind(this), function(err) {
                if (err.field_errors && err.field_errors.OldPassword) {
                    this.passwordError(err.field_errors.OldPassword);
                } else if (err.field_errors && err.field_errors.Password) {
                    this.passwordError(err.field_errors.Password);
                } else {
                    this.passwordError(err.error ? err.error : 'An error occurred.');
                }
            }.bind(this));
        }
    },
    updateEmail: function(e) {
        e.preventDefault();
        this.emailError(null);

        if (this.newEmail() != this.confirmEmail()) {
            this.emailError('New email addresses do not match.');
        } else {
            req({
                endpoint: '/user/' + this.user.id,
                method: 'PUT',
                data: { email: this.newEmail() }
            }).then(function(data) {
                if (data.ok) {
                    if (this.user.id == auth.user().id) auth.user(data.user);
                    layout.notices().push('Email change in progress. We\'ve sent emails to both your current and new email addresses to confirm the change.');
                    this.newEmail('');
                    this.confirmEmail('');
                } else {
                    this.emailError(data.error ? data.error : 'An error occurred.');
                }
            }.bind(this), function(err) {
                if (err.field_errors && err.field_errors.Email) {
                    this.emailError(err.field_errors.Email);
                } else {
                    this.emailError(err.error ? err.error : 'An error occurred.');
                }
            }.bind(this));
        }
    },
    updateRoles: function(e) {
        e.preventDefault();
        this.rolesError(null);

        var roles = 0;
        if (this.roleVerified()) roles |= 1;
        if (this.roleExecutive()) roles |= 2;
        if (this.roleAdmin()) roles |= 4;
        if (this.roleModerator()) roles |= 8;

        req({
            endpoint: '/user/' + this.user.id,
            method: 'PUT',
            data: { roles: roles }
        }).then(function(data) {
            if (data.ok) {
                if (this.user.id == auth.user().id) auth.user(data.user);
                layout.notices().push('Roles updated.');
            } else {
                this.rolesError(data.error ? data.error : 'An error occurred.');
            }
        }.bind(this), function(err) {
            if (err.field_errors && err.field_errors.Roles) {
                this.rolesError(err.field_errors.Roles);
            } else {
                this.rolesError(err.error ? err.error : 'An error occurred.');
            }
        }.bind(this));
    }
};

module.exports = vm;
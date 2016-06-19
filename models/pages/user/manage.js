var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var param = require('util/param.js');
var req = require('util/request.js');
var title = require('util/page/title.js');
var social = require('util/socialaccounts.js');
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

    this.saving = m.prop(false);
    this.socialSaved = m.prop(false);
    this.emailSaved = m.prop(false);
    this.usernameSaved = m.prop(false);
    this.passwordSaved = m.prop(false);
    this.rolesSaved = m.prop(false);
    this.socialError = m.prop(null);
    this.emailError = m.prop(null);
    this.usernameError = m.prop(null);
    this.passwordError = m.prop(null);
    this.rolesError = m.prop(null);

    this.social = {};
    _.each(social, function(info, type) {
        this.social[type] = {
            type: type,
            name: info.name,
            icon: info.icon,
            color: info.color,
            id: m.prop(''),
            primary: false
        };
    }.bind(this));

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

            _.each(this.user.social_accounts, function(acct) {
                if (this.social[acct.type]) {
                    this.social[acct.type].id(acct.id);
                    this.social[acct.type].primary = acct.is_primary;
                }
            }.bind(this));

            title(this, this.user.username);
        }.bind(this));
    } else {
        m.route('/404');
    }
};

vm.prototype = {
    primarySocial: function(vm, type, e) {
        var checked = this.checked;
        _.each(vm.social, function(info, t) {
            info.primary = (type == t) && checked;
        });
    },
    updateSocial: function(e) {
        e.preventDefault();
        this.socialError(null);
        this.socialSaved(false);

        var accounts = [];
        _.each(this.social, function(info) {
            if (info.id()) {
                accounts.push({
                    type: info.type,
                    id: info.id(),
                    is_primary: info.primary
                });
            }
        });

        this.saving(true);
        req({
            endpoint: '/user/' + this.user.id,
            method: 'PUT',
            data: { accounts: accounts }
        }).then(function(data) {
            this.saving(false);

            if (data.ok) {
                if (this.user.id == auth.user().id) auth.user(data.user);
                this.socialSaved(true);
                _.delay(function() { this.socialSaved(false); m.redraw(); }.bind(this), 10000);
            } else {
                this.socialError(data.error ? data.error : 'An error occurred');
            }
        }.bind(this), function(err) {
            this.saving(false);
            this.socialError(err.error ? err.error : 'An error occurred.');
        }.bind(this));
    },
    updateUsername: function(e) {
        e.preventDefault();
        this.usernameError(null);

        this.saving(true);
        req({
            endpoint: '/user/' + this.user.id,
            method: 'PUT',
            data: { username: this.newUsername() }
        }).then(function(data) {
            this.saving(false);

            if (data.ok) {
                if (this.user.id == auth.user().id) auth.user(data.user);
                this.user.username = data.user.username;

                this.usernameSaved(true);
                _.delay(function() { this.usernameSaved(false); m.redraw(); }.bind(this), 10000);
                this.newUsername('');
            } else {
                this.usernameError(data.error ? data.error : 'An error occurred.');
            }
        }.bind(this), function(err) {
            this.saving(false);

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
            this.saving(true);
            req({
                endpoint: '/user/' + this.user.id,
                method: 'PUT',
                data: { old_password: this.password(), password: this.newPassword() }
            }).then(function(data) {
                this.saving(false);

                if (data.ok) {
                    this.passwordSaved(true);
                    _.delay(function() { this.passwordSaved(false); m.redraw(); }.bind(this), 10000);
                    this.password('');
                    this.newPassword('');
                    this.confirmPassword('');
                } else {
                    this.passwordError(data.error ? data.error : 'An error occurred.');
                }
            }.bind(this), function(err) {
                this.saving(false);

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
    /*updateEmail: function(e) {
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
    },*/
    updateRoles: function(e) {
        e.preventDefault();
        this.rolesError(null);

        var roles = 0;
        if (this.roleVerified()) roles |= 1;
        if (this.roleExecutive()) roles |= 2;
        if (this.roleAdmin()) roles |= 4;
        if (this.roleModerator()) roles |= 8;

        this.saving(true);
        req({
            endpoint: '/user/' + this.user.id,
            method: 'PUT',
            data: { roles: roles }
        }).then(function(data) {
            this.saving(false);

            if (data.ok) {
                if (this.user.id == auth.user().id) auth.user(data.user);
                this.rolesSaved(true);
                _.delay(function() { this.rolesSaved(false); m.redraw(); }.bind(this), 10000);
            } else {
                this.rolesError(data.error ? data.error : 'An error occurred.');
            }
        }.bind(this), function(err) {
            this.saving(false);

            if (err.field_errors && err.field_errors.Roles) {
                this.rolesError(err.field_errors.Roles);
            } else {
                this.rolesError(err.error ? err.error : 'An error occurred.');
            }
        }.bind(this));
    }
};

module.exports = vm;
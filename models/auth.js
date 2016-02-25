var supports = require('../util/supports.js');
var _ = require('underscore');

var auth = new function() {
    var key = null;
    var user = null;

    this.RoleVerified = 1;
    this.RoleExecutive = 2;
    this.RoleAdmin = 4;
    this.RoleModerator = 8;

    this.RolePrivileged = this.RoleExecutive | this.RoleAdmin | this.RoleModerator;
    this.RoleManager = this.RoleExecutive | this.RoleAdmin;

    this.key = function(k) {
        if (k !== undefined) {
            key = k;
            if (supports.localStorage()) {
                if (k !== null) {
                    localStorage.setItem('auth', k);
                } else {
                    localStorage.removeItem('auth');
                }
            }
        } else if (key === null) {
            if (supports.localStorage()) {
                key = localStorage.getItem('auth');
            }
        }
        return key;
    };

    this.user = function(u) {
        if (u !== undefined) {
            user = u;
            if (supports.localStorage()) {
                if (u !== null) {
                    localStorage.setItem('auth:user', JSON.stringify(u));
                } else {
                    localStorage.removeItem('auth:user');
                }
            }
        } else if (user === null) {
            if (supports.localStorage()) {
                user = JSON.parse(localStorage.getItem('auth:user'));
            }
        }
        return user;
    };

    this.isPrivileged = function() {
        var user = this.user();
        if (!user) {
            return false;
        }

        return (user.roles & this.RolePrivileged) > 0;
    };

    this.isManager = function() {
        var user = this.user();
        if (!user) {
            return false;
        }

        return (user.roles & this.RoleManager) > 0;
    };

    this.logout = function(force) {
        if (force) {
            this.key(null);
            this.user(null);
        } else {
            var req = require('../util/request.js');
            req({
                endpoint: '/auth',
                method: 'DELETE'
            }).then(_.bind(function(response) {
                if (response.ok) {
                    this.key(null);
                    this.user(null);
                }
            }, this));
        }
    }
};

module.exports = auth;
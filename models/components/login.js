var m = require('mithril');
var $ = require('jquery');
var layout = require('../../views/layout/skeleton.js');
var auth = require('../auth.js');
var req = require('../../util/request.js');

var vm = function() {
    this.email = m.prop('');
    this.password = m.prop('');

    this.emailError = m.prop(false);
    this.passwordError = m.prop(false);
};

vm.prototype = {
    serialize: function() {
        return {
            email: this.email(),
            password: this.password()
        };
    },
    submit: function(e) {
        e.preventDefault();

        req({
            endpoint: '/auth',
            method: 'POST',
            data: this.serialize()
        }, true).then(function(data) {
            if (data.ok && data.token) {
                auth.key(data.token);
                auth.user(data.user);

                $('#loginModal').modal('hide');
            } else if (data.error) {
                layout.errors().push(data.error);
            } else {
                layout.errors().push('An error occurred.');
            }
        }, function(err) {
            if (err.field_errors) {
                if (err.field_errors.Email) {
                    this.emailError(err.field_errors.Email);
                }
                if (err.field_errors.Password) {
                    this.passwordError(err.field_errors.Password);
                }
            }
            if (err.error) {
                layout.errors().push(err.error);
            }
        });

        return false;
    }
};

module.exports = vm;
var m = require('mithril');
var $ = require('jquery');
var layout = require('../../../views/layout/skeleton.js');
var auth = require('../../auth.js');
var req = require('../../../util/request.js');

var vm = function() {
    this.email = m.prop('');
    this.password = m.prop('');

    this.error = m.prop(null);
    this.emailError = m.prop(null);
    this.passwordError = m.prop(null);
};

vm.prototype = {
    closeModal: function(e) {
        if (e) {
            e.preventDefault();
        }

        $('#loginModal').modal('hide');
    },
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

                self.closeModal();
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

module.exports = vm;
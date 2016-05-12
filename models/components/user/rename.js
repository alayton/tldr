var m = require('mithril');
var $ = require('jquery');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');
var req = require('util/request.js');

var vm = function() {
    this.username = m.prop('');

    this.error = m.prop(null);
    this.usernameError = m.prop(null);
};

vm.prototype = {
    closeModal: function() {
        $('#renameModal').modal('hide');
    },
    validate: function() {
        var username = this.username(),
            result = true;

        if (username.length < 3 || username.length > 20) {
            result = false;
            this.error('Username must be 3-20 characters long.');
        } else {
            this.usernameError(null);
        }

        return result;
    },
    serialize: function() {
        return {
            username: this.username()
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
            endpoint: '/user/' + auth.user().id,
            method: 'PUT',
            data: this.serialize()
        }).then(function(data) {
            if (data.ok) {
                self.closeModal();
                auth.user(data.user);
            } else if (data.error) {
                layout.errors().push(data.error);
            } else {
                layout.errors().push('An error occurred.');
            }
        }, function(err) {
            if (err.field_errors) {
                if (err.field_errors.Username) {
                    self.usernameError(err.field_errors.Username);
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
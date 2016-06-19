var m = require('mithril');
var _ = require('underscore');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');
var modal = require('util/modal.js');
var req = require('util/request.js');

var model = function() {
    this.username = m.prop('');

    this.error = m.prop(null);
    this.usernameError = m.prop(null);
};

model.prototype = {
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
    submit: function(e) {
        e.preventDefault();
        this.error(null);

        if (!this.validate()) {
            return false;
        }

        req({
            endpoint: '/user/' + auth.user().id,
            method: 'PUT',
            data: { username: this.username() }
        }).then(function(data) {
            if (data.ok) {
                modal.hide();
                auth.user(data.user);
            } else if (data.error) {
                layout.errors().push(data.error);
            } else {
                layout.errors().push('An error occurred.');
            }
        }.bind(this), function(err) {
            if (err.field_errors) {
                if (err.field_errors.Username) {
                    this.usernameError(err.field_errors.Username);
                }
            }

            if (err.error) {
                this.error(err.error);
            }
        }.bind(this));

        return false;
    }
};

var view = function(vm) {
    return m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('h4.modal-title', 'Choose your username')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', { className: vm.usernameError() ? 'has-danger' : '' }, [
                m('label[for=signup-username]', 'Username'),
                m('input.form-control#signup-username', { type: 'text', onchange: m.withAttr('value', vm.username), onblur: _.bind(vm.validate, vm), value: vm.username() }),
                vm.usernameError() ? m('small', vm.usernameError()) : null
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-primary[type=submit]', 'Set name')
        ])
    ]);
};

module.exports = modal(model, view);
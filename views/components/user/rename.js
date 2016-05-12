var m = require('mithril');
var _ = require('underscore');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');

module.exports = function(vm) {
    return m('#renameModal.modal.fade', m('.modal-dialog', m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
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
    ])))
};
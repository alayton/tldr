var m = require('mithril');
var _ = require('underscore');
var modal = require('util/modal.js');
var req = require('util/request.js');

var close = function() {
    modal.hide();
};

var model = function(comment) {
    this.comment = comment;

    this.reason = m.prop('');
    this.error = m.prop(null);
};

model.prototype = {
    submit: function(e) {
        e.preventDefault();
        this.error(null);

        req({
            endpoint: '/comments/report/' + this.comment.id,
            method: 'POST',
            data: { reason: this.reason() }
        }).then(function(data) {
            if (data.ok) {
                this.comment.reported = true;

                close();
            } else if (data.error) {
                this.error(data.error);
            } else {
                this.error('An error occurred.');
            }
        }.bind(this), function(data) {
            if (data.field_errors && data.field_errors.Reason) {
                self.error(data.field_errors.reason);
            }

            if (data.error) {
                this.error(data.error);
            }
        }.bind(this));

        return false;
    }
};

var view = function(vm) {
    return m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: close }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Reporting a comment')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', [
                m('label[for=email]', 'Reason'),
                m('textarea.form-control', { onchange: m.withAttr('value', vm.reason), value: vm.reason() })
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-secondary[type=button]', { onclick: close }, 'Cancel'),
            m('button.btn.btn-primary[type=submit]', 'Submit report')
        ])
    ]);
};

module.exports = function(opts) {
    return modal(model, view, opts);
};
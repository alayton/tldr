var $ = require('jquery');
var _ = require('underscore');
var m = require('mithril');

var Modal = function(model, view, opts, modalOpts) {
    return m.component({
        controller: model,
        view: function(vm) {
            return m('.modal', {
                onclick: function(e) {
                    if (e.target && e.target.className == 'modal') Modal.hide();
                },
                config: function(el, isInitialized) {
                    if (Modal.closing || isInitialized) return;

                    var $body = $('body'),
                        normalWidth = $body.width();

                    $body.toggleClass('has-modal', true);
                    $body.css('padding-right', ($body.width() - normalWidth) + 'px');
                }
            }, m('.modal-dialog', { className: modalOpts.className }, view(vm)));
        }
    }, opts);
};

Modal.current = null;
Modal.closing = false;

Modal.show = function(modal) {
    Modal.current = modal;
};

Modal.hide = function() {
    var $body = $('body');

    $body.toggleClass('has-modal', false);
    $body.css('padding-right', '');
    Modal.closing = true;

    _.delay(function() {
        Modal.current = null;
        Modal.closing = false;
        m.redraw();
    }, 250);
};

module.exports = Modal;
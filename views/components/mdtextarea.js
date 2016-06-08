var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');

var autosize = function(el, isInitialized) {
    if (isInitialized) {
        return;
    }

    $(el).on('input', function() {
        var $this = $(this);
        $this.css({ height: 'auto', 'overflow-y': 'hidden' });

        var height = Math.max(Math.min(300, this.scrollHeight), 76);
        var overflow = this.scrollHeight <= 300 ? 'hidden' : 'auto';
        $this.parent().css({ height: height + 'px' }).toggleClass('no-fade', !$this.val() && !$this.is(':focus'));
        $this.css({ height: '', 'overflow-y': overflow });
    }).trigger('input');

    $(el).on('focus blur', function() {
        var $this = $(this);
        $this.parent().toggleClass('no-fade', !$this.val() && !$this.is(':focus'));
    });
};

module.exports = function(vm) {
    return m('.form-group.md-controls', [
        m('.toolbar', [
            m('a', { onclick: vm.bold }, m('i.fa.fa-bold', { title: 'Bold' })),
            m('a', { onclick: vm.italic }, m('i.fa.fa-italic', { title: 'Italic' })),
            m('a', { onclick: vm.strikethrough }, m('i.fa.fa-strikethrough', { title: 'Strikethrough' })),
            m('a', { onclick: vm.header }, m('i.fa.fa-header', { title: 'Header' })),
            m('a', { onclick: vm.link }, m('i.fa.fa-link', { title: 'Link' })),
            m('a', { onclick: vm.blockquote }, m('i.fa.fa-quote-right', { title: 'Blockquote' })),
            m('a', { onclick: vm.ul }, m('i.fa.fa-list-ul', { title: 'Bulleted List' })),
            m('a', { onclick: vm.ol }, m('i.fa.fa-list-ol', { title: 'Numbered List' })),
            m('a', { onclick: vm.hr }, m('i.fa.fa-minus', { title: 'Horizontal Rule' })),
            m('a', { onclick: vm.tt }, m('i.fa.fa-text-width', { title: 'Monospace' })),
            m('a', { onclick: vm.code }, m('i.fa.fa-code', { title: 'Code Block' })),
            m('a', { onclick: vm.table }, m('i.fa.fa-table', { title: 'Table' }))
        ]),
        m('.text', [
            m('.background'),
            m('textarea', {
                config: autosize,
                oninput: m.withAttr('value', vm.val),
                value: vm.val()
            })
        ])
    ]);
};
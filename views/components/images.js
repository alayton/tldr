var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var layout = require('../layout/skeleton.js');
var auth = require('../../models/auth.js');

var categoryConfig = function(vm, el, isInitialized) {
    if (isInitialized) return;

    $(el).on('show.bs.tab', function() {
        vm.loadCategory();
    });
};

var userConfig = function(vm, el, isInitialized) {
    if (isInitialized) return;

    $(el).on('show.bs.tab', function() {
        vm.loadUser();
    });
};

module.exports = function(vm) {
    var catgImages = vm.categoryImages(),
        userImages = vm.userImages();

    return m('#imagesModal.modal.fade', m('.modal-dialog.modal-lg', m('.modal-content', [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: vm.closeModal }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Choose an image')
        ]),
        m('.modal-body', [
            m('ul.nav.nav-tabs', [
                m('li.nav-item', m('a.nav-link[href=#imagelibrary]', { 'data-toggle': 'tab', config: _.partial(categoryConfig, vm) }, 'Image Library')),
                m('li.nav-item', m('a.nav-link[href=#yourimages]', { 'data-toggle': 'tab', config: _.partial(userConfig, vm) }, 'Your Images')),
                m('li.nav-item.active', m('a.nav-link[href=#uploadimage]', { 'data-toggle': 'tab' }, 'Upload Image'))
            ]),
            m('.tab-content', [
                m('.tab-pane#imagelibrary', catgImages ?
                    m('.card-deck', _.map(catgImages, function(img) {
                        return m('a.card', {
                            href: 'javascript:;',
                            style: { width: '200px', flex: 'none' },
                            onclick: _.partial(vm.click, vm, img)
                        }, [
                            m('img.card-img-top', { src: '//tldrapi.alayton.com/image/' + img.id + '/200/0', width: 200, height: (200 * (img.height / img.width)) }),
                            m('.card-block', [
                                m('p.card-text', img.name)
                            ])
                        ]);
                    })) :
                    m('i.fa.fa-spinner.fa-pulse')
                ),
                m('.tab-pane#yourimages', userImages ?
                    m('.card-deck', _.map(userImages, function(img) {
                        return m('a.card', {
                            href: 'javascript:;',
                            style: { width: '200px', flex: 'none' },
                            onclick: _.partial(vm.click, vm, img)
                        }, [
                            m('img.card-img-top', { src: '//tldrapi.alayton.com/image/' + img.id + '/200/0', width: 200, height: (200 * (img.height / img.width)) }),
                            m('.card-block', [
                                m('p.card-text', img.name)
                            ])
                        ]);
                    })) :
                    m('i.fa.fa-spinner.fa-pulse')
                ),
                m('.tab-pane.active#uploadimage', [
                    m('div', [
                        m('label.file', [
                            m('input#imagefile[type=file]'),
                            m('span.file-custom')
                        ])
                    ]),
                    m('button.btn.btn-primary', { onclick: _.partial(vm.upload, vm) }, 'Upload Image')
                ])
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-secondary', { onclick: vm.closeModal }, 'Cancel')
        ])
    ])))
};
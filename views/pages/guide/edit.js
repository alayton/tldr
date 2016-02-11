var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var layout = require('../../layout/sidebar.js');
var categoryTag = require('../../../controllers/components/categorytag.js');
var mdtextarea = require('../../../controllers/components/mdtextarea.js');

var md = require('markdown-it')()
    .disable(['image']);

module.exports = function(vm) {
    return layout(vm.guide === false ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        [
            m('.guide-header', [
                m('h2', m('input.form-control', { type: 'text', onchange: m.withAttr('value', vm.guide.title), value: vm.guide.title() })),
                m('.tags', [
                    m('a.tag.category', {
                        href: '/guides/' + vm.guide.category.id + '-' + slug(vm.guide.category.name),
                        config: m.route
                    }, vm.guide.category.name),
                    _.map(vm.guide.tags, function(tag) {
                        return m('a.tag.current', {
                            href: 'javascript:;',
                            onclick: _.bind(vm.removeTag, vm, tag)
                        }, [m('i.fa.fa-times'), tag.name]);
                    }),
                    _.map(vm.tags, function(tag) {
                        if (vm.hasTag(tag)) {
                            return null;
                        } else if (tag.leaf) {
                            return m('a.tag', {
                                href: 'javascript:;',
                                onclick: _.bind(vm.addTag, vm, tag)
                            }, [m('i.fa.fa-plus'), tag.name]);
                        } else {
                            return m.component(categoryTag, { tag: tag, addFunc: vm.addTag, context: vm, onclick: true });
                        }
                    })
                ])
            ]),
            m('.guide-body', _.map(vm.body, function(section) {
                return m('.section', [
                    m('h3', m('input.form-control', { type: 'text', onchange: m.withAttr('value', section.title), value: section.title() })),
                    m.component(mdtextarea, { val: section.text }),
                    m('.preview', m.trust(md.render(section.text())))
                ]);
            })),
            m('.guide-controls', [
                m('button.btn.pull-right', {
                    onclick: _.partial(vm.save, vm),
                    disabled: vm.saving(),
                    className: vm.saved() ? 'btn-success' : 'btn-primary'
                }, [m('i.fa.fa-save'), vm.saved() ? ' Saved!' : ' Save'])
            ])
        ]
    );
};
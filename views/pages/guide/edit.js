var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var imageurl = require('../../../util/imageurl.js');
var romanize = require('../../../util/romanize.js');
var layout = require('../../layout/sidebar.js');
var categoryTag = require('../../../controllers/components/tag/categorytag.js');
var mdtextarea = require('../../../controllers/components/mdtextarea.js');

var md = require('markdown-it')()
    .disable(['image']);

var currentImage = null;

var showImages = function(image) {
    $('#imagesModal').modal('show');
    currentImage = image;
};

var pickImage = function(id) {
    if (currentImage) {
        currentImage(id);
    }
};

module.exports = function(vm) {
    var images = require('../../../controllers/components/images.js');

    return layout(vm.error !== null ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        [
            m('.guide-header', [
                m('input.form-control', { type: 'text', onchange: m.withAttr('value', vm.guide.title), value: vm.guide.title(), placeholder: 'Guide Title' }),
                m('var', { className: vm.guide.title().length > 120 ? 'limited' : '' }, [vm.guide.title().length, ' / 120']),
                m('.tags', [
                    m('label', 'Tags'),
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
            m('.guide-body', _.map(vm.body, function(section, idx) {
                var img = section.image(),
                    imgWidth = img ? Math.min(871, img.width) : 0;

                return m('.section', [
                    m.component(mdtextarea, { val: section.text }),
                    m('var', { className: section.text().length > 200 ? 'limited' : '' }, [section.text().length, ' / 200']),
                    m('.preview', [
                        m('header', romanize(idx + 1)),
                        m.trust(md.render(section.text()))
                    ]),
                    img ?
                        m('.image', m('img', { src: imageurl(img.id, imgWidth), style: { maxWidth: imgWidth + 'px' } })) :
                        [],
                    m('.section-controls', [
                        m('button.btn.btn-secondary', {
                            onclick: _.partial(showImages, section.image)
                        }, [m('i.fa.fa-picture-o'), ' Choose Image']),
                        m('button.btn.btn-danger', {
                            onclick: _.partial(vm.delSection, vm, idx)
                        }, [m('i.fa.fa-times'), ' Remove'])
                    ])
                ]);
            })),
            m('.guide-controls', [
                m('button.btn.btn-info', {
                    onclick: _.partial(vm.addSection, vm)
                }, [m('i.fa.fa-plus'), ' Add Section']),
                m('.fill'),
                m('a.btn.btn-secondary', vm.guide.id ?
                    {
                        href: '/guide/' + vm.guide.id + '-' + slug(vm.guide.title()),
                        config: m.route
                    } :
                    {
                        href: 'javascript:;',
                        disabled: true
                    },
                    [m('i.fa.fa-link'), ' View Guide']),
                m('button.btn', {
                    onclick: _.partial(vm.save, vm),
                    disabled: vm.saving(),
                    className: vm.saved() ? 'btn-success' : 'btn-primary'
                }, [m('i.fa.fa-save'), vm.saved() ? ' Saved!' : ' Save'])
            ]),
            m.component(images, { category: vm.guide.category_id, select: pickImage })
        ]
    );
};
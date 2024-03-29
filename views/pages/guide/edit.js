var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var modal = require('util/modal.js');
var guideurl = require('util/guideurl.js');
var imageurl = require('util/imageurl.js');
var romanize = require('util/romanize.js');
var layout = require('views/layout/sidebar.js');
var categoryTag = require('controllers/components/tag/categorytag.js');
var mdtextarea = require('controllers/components/mdtextarea.js');
var rate = require('controllers/components/guide/rate.js');
var guideList = require('views/components/guide/list.js');

var md = require('markdown-it')()
    .disable(['image']);

var currentImage = null;

var showImages = function(vm, image) {
    var images = require('views/modals/images.js');
    modal.show(images({ category: vm.guide.category_id, select: pickImage }));

    currentImage = image;
};

var pickImage = function(id) {
    if (currentImage) {
        currentImage(id);
    }
};

var guideImage = function(guide, image) {
    guide.image_id = image.id;
};

var stickyControls = function(el, isInitialized) {
    if (isInitialized) return;

    $(el).fixedsticky();
};

module.exports = function(vm) {
    var moderated = vm.guide.status == 2 && !auth.isPrivileged(),
        div = null;

    if (typeof document !== 'undefined') div = document.createElement('div');

    return layout(vm.error !== null ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        m('.guide-editor', [
            m('.guide-header.clearfix', [
                m.component(rate, { guide: vm.guide, parent: vm }),
                m('.guide-image', [
                    m('img', { src: vm.guide.image_id ? imageurl(vm.guide.image_id, 160, 120) : '/asset/img/guide-ph.png' }),
                    m('button.btn.btn-secondary', { onclick: _.partial(showImages, vm, _.partial(guideImage, vm.guide)) }, [m('i.fa.fa-picture-o'), ' Choose Image'])
                ]),
                m('.guide-title', [
                    m('input.form-control', {
                        type: 'text',
                        onchange: m.withAttr('value', vm.guide.title),
                        value: vm.guide.title(),
                        placeholder: 'Guide Title',
                        className: vm.fieldErrors.Title ? 'error' : ''
                    }),
                    m('var', { className: vm.guide.title().length > vm.titleLength ? 'limited' : '' }, [vm.guide.title().length, ' / ', vm.titleLength]),
                    m('label', 'Guide Status'),
                    m('select.c-select', { onchange: m.withAttr('value', vm.guide.status), value: vm.guide.status() }, [
                        m('option.warning', { disabled: moderated, value: 0 }, 'In Progress'),
                        m('option.success', { disabled: moderated, value: 1 }, 'Public'),
                        m('option.danger', { disabled: moderated, value: 3 }, 'Deleted'),
                        m('option.danger', { disabled: !auth.isPrivileged(), value: 2 }, 'Moderated')
                    ]),
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
                ])
            ]),
            m('.guide-controls', { config: stickyControls }, [
                m('button.btn.btn-info', {
                    className: (vm.body.length >= vm.maxSections ? 'disabled' : ''),
                    title: (vm.body.length >= vm.maxSections ? 'Limit of ' + vm.maxSections + ' sections reached' : ''),
                    onclick: _.partial(vm.addSection, vm)
                }, [m('i.fa.fa-plus'), ' Add Section']),
                m('.fill'),
                m('a.btn.btn-secondary', vm.guide.id ?
                    { href: guideurl(vm.guide), config: m.route } :
                    { href: 'javascript:;', disabled: true },
                    [m('i.fa.fa-link'), ' View Guide']),
                /*vm.guide.status() == 1 ? [] : m('button.btn.btn-success', {
                    onclick: _.partial(vm.publish, vm)
                }, [m('i.fa.fa-save'), ' Save & Publish']),*/
                m('button.btn', {
                    onclick: _.partial(vm.save, vm),
                    disabled: vm.saving(),
                    className: vm.saved() ? 'btn-success' : 'btn-primary'
                }, [m('i.fa.fa-save'), vm.saved() ? ' Saved!' : ' Save'])
            ]),
            m('.guide-body', _.map(vm.body, function(section, idx) {
                var img = section.image(),
                    imgWidth = img ? Math.min(871, img.width) : 0;

                var sectionHTML = md.render(section.text());
                div.innerHTML = sectionHTML;
                var length = div.innerText.length;

                return m('section', [
                    m.component(mdtextarea, { val: section.text }),
                    m('var', { className: length > vm.sectionLength ? 'limited' : '' }, [length, ' / ', vm.sectionLength]),
                    m('.preview.clearfix', [
                        m('header', romanize(idx + 1)),
                        m('article', [
                            m.trust(sectionHTML),
                            img ?
                                m('.image', m('img', { src: imageurl(img.id, imgWidth), style: { maxWidth: imgWidth + 'px' } })) :
                                []
                        ])
                    ]),
                    m('.section-controls', [
                        m('button.btn.btn-secondary', {
                            onclick: _.partial(showImages, vm, section.image)
                        }, [m('i.fa.fa-picture-o'), ' Choose Image']),
                        img ? m('button.btn.btn-warning', {
                            onclick: _.partial(section.image, 0)
                        }, [m('i.fa.fa-minus-square-o'), ' Remove Image']) : [],
                        m('button.btn.btn-danger', {
                            onclick: _.partial(vm.delSection, vm, idx)
                        }, [m('i.fa.fa-times'), ' Remove Section'])
                    ])
                ]);
            })),
            m('.guide-extras', [
                m('section.source', [
                    m('h3', 'Source'),
                    m('.form-group.row', [
                        m('.col-sm-7', [
                            m('label.sr-only[for=guideSourceUrl]', 'Source URL'),
                            m('input.form-control[type=text]', {
                                id: 'guideSourceUrl',
                                placeholder: 'Source URL',
                                oninput: m.withAttr('value', vm.guide.source_url),
                                val: vm.guide.source_url()
                            })
                        ]),
                        m('.col-sm-5', [
                            m('label.sr-only[for=guideSourceTitle]', 'Source title'),
                            m('input.form-control[type=text]', {
                                id: 'guideSourceTitle',
                                placeholder: 'Source title',
                                oninput: m.withAttr('value', vm.guide.source_title),
                                val: vm.guide.source_title()
                            })
                        ])
                    ]),
                    m('small.text-muted', 'If you want to credit a source for your information, this is the spot!'),
                ]),
                m('section.suggested', [
                    m('h3', 'Suggested Guides'),
                    guideList(vm, vm.guide.suggestions, true, function(g) {
                        return m('button.remove.btn.btn-danger', { onclick: vm.removeSuggestion.bind(vm, g) }, m('i.fa.fa-times'));
                    }),
                    vm.suggestionError ? m('.alert.alert-danger', vm.suggestionError) : [],
                    m('form', { onsubmit: vm.addSuggestion.bind(vm) }, [
                        m('input[type=text]', {
                            oninput: m.withAttr('value', vm.suggestionUrl),
                            value: vm.suggestionUrl(),
                            placeholder: 'Guide URL...'
                        }),
                        m('button[type=submit].btn.btn-info', [
                            vm.addingSuggestion ? m('i.fa.fa-spinner.fa-pulse') : m('i.fa.fa-plus'),
                            ' Add Suggestion'
                        ])
                    ])
                ])
            ])
        ]), 'edit-guide');
};
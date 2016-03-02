var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var slug = require('slug');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');
var auth = require('../../../models/auth.js');

var currentImage = null;

var showImages = function(image, e) {
    e.preventDefault();

    $('#imagesModal').modal('show');
    currentImage = image;

    return false;
};

var pickImage = function(img) {
    if (currentImage) {
        currentImage(img.id);
    }
};

module.exports = function(vm) {
    var images = require('../../../controllers/components/images.js');

    return layout([
        m('h2', vm.tag.id ? 'Editing Tag: ' + vm.tag.name() : 'Create Tag'),
        m('.tag-form', m('form', { onsubmit: _.partial(vm.save, vm) }, [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('.form-group', { className: vm.nameError() ? 'has-danger' : '' }, [
                m('label[for=tag-name]', 'Name'),
                m('input.form-control#tag-name', { type: 'text', onchange: m.withAttr('value', vm.tag.name), value: vm.tag.name() }),
                vm.nameError() ? m('small', vm.nameError()) : null
            ]),
            m('.form-group', [
                m('label', 'Image'),
                vm.tag.image() ? m('img', { width: 240, height: 200, src: imageurl(vm.tag.image(), 240, 200) }) : [],
                m('button.btn.btn-secondary', {
                    onclick: _.partial(showImages, vm.tag.image),
                    style: { display: 'block' }
                }, [m('i.fa.fa-picture-o'), ' Choose Image'])
            ]),
            m('.checkbox', [
                m('label', [
                    m('input[type=checkbox]', { onclick: m.withAttr('checked', vm.tag.leaf), checked: vm.tag.leaf() }),
                    'Leaf'
                ])
            ]),
            m('.checkbox', [
                m('label', [
                    m('input[type=checkbox]', { onclick: m.withAttr('checked', vm.tag.allowLeafs), checked: vm.tag.allowLeafs() }),
                    'Allow Leafs'
                ])
            ]),
            m('button.btn', {
                onclick: _.partial(vm.save, vm),
                disabled: vm.saving(),
                className: vm.saved() ? 'btn-success' : 'btn-primary'
            }, [m('i.fa.fa-save'), vm.saved() ? ' Saved!' : ' Save'])
        ])),
        m('.tag-block', [
            m('h2', 'Child Tags'),
            m('.tag-list', _.map(vm.children, function(child) {
                return m('a.tag', {
                    href: '/tag/edit/' + child.id + '-' + slug(child.name),
                    config: m.route
                }, child.name);
            })),
            m('a.btn.btn-secondary', {
                href: '/tag/new/' + vm.tag.id + '-' + slug(vm.tag.name()),
                config: m.route
            }, 'Add child')
        ]),
        vm.parent ? m('.tag-block', [
            m('h2', 'Parent Tag'),
            m('a.tag', {
                href: '/tag/edit/' + vm.parent.id + '-' + slug(vm.parent.name()),
                config: m.route
            }, vm.parent.name())
        ]) : [],
        m.component(images, { category: vm.tag.category_id, select: pickImage })
    ])
};
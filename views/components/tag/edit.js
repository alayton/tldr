var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/skeleton.js');
var auth = require('../../../models/auth.js');

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

    return m('#editTagModal.modal', m('.modal-dialog.modal-lg', m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: _.bind(vm.close, vm) }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Edit Tag')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', { className: vm.nameError() ? 'has-danger' : '' }, [
                m('label[for=tag-name]', 'Name'),
                m('input.form-control#tag-name', { type: 'text', onchange: m.withAttr('value', vm.tag.name), onblur: _.bind(vm.validate, vm), value: vm.tag.name() }),
                vm.nameError() ? m('small', vm.nameError()) : null
            ]),
            m('fieldset.form-group', [
                m('label', 'Image'),
                vm.tag.image() ? m('img', { width: 240, height: 200, src: imageurl(vm.tag.image(), 240, 200) }) : [],
                m('button.btn.btn-secondary', { onclick: _.partial(showImages, vm.tag.image) }, [m('i.fa.fa-picture-o'), ' Choose Image'])
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-secondary', { onclick: _.bind(vm.close, vm) }, 'Cancel')
        ]),
        m.component(images, { category: vm.tag.category, select: pickImage })
    ])))
};
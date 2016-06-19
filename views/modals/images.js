var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var config = require('config.js');
var modal = require('util/modal.js');
var req = require('util/request.js');
var crop = require('controllers/components/crop.js');
var pagination = require('views/components/pagination.js');

var close = function() {
    modal.hide();
};

var model = function(opts) {
    this.select = opts.select;
    this.category = opts.catg;

    this.mime = null;
    this.preview = m.prop(null);
    this.buffer = m.prop(null);
    this.image = null;
    this.error = null;
    this.progress = null;
    this.uploading = false;

    this.categoryImages = m.prop(null);
    this.userImages = m.prop(null);
    this.userPage = m.prop(1);
    this.userResults = m.prop(0);
    this.userPerPage = m.prop(20);

    this.loadingCategory = false;
    this.loadingUser = false;
};

var serializeArrayBufferView = function(data) {
    return new Int8Array(data);
};

var serializePassthrough = function(data) {
    return data;
};

var addProgress = function(vm, xhr) {
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', _.partial(onProgress, vm));
    }
};

var onProgress = function(vm, e) {
    if (e.lengthComputable) {
        var pos = e.position || e.loaded,
            total = e.totalSize || e.total;
        vm.progress = pos / total;
        m.redraw();
    } else {
        vm.progress = null;
    }
};

model.prototype = {
    click: function(img, e) {
        if (e) e.preventDefault();

        this.select(img);
        close();
        return false;
    },
    loadPreview: function(self, e) {
        self.buffer(null);
        self.preview(null);
        self.image = null;
        self.error = null;

        if (!this.files || this.files.length == 0) {
            return;
        }

        var file = this.files[0],
            reader = new FileReader();

        if (!{'image/jpeg': true, 'image/png': true, 'image/gif': true}[file.type]) {
            self.error = 'Images must be a JPG, PNG, or GIF file.';
            return;
        } else if (file.size > 8 * 1024 * 1024) {
            self.error = 'Images must be less than 8MB in size.';
            return;
        }

        self.mime = file.type;

        reader.onload = function() {
            self.preview(reader.result);

            var bufReader = new FileReader();
            bufReader.onload = function() {
                self.image = bufReader.result;
                m.redraw();
            };
            bufReader.readAsArrayBuffer(file);
        };

        reader.readAsDataURL(file);
    },
    upload: function(e) {
        e.preventDefault();
        if (this.uploading) {
            return;
        }

        var buf = this.buffer();
        if (!this.image && !buf) {
            this.error = 'No image selected.';
            return;
        }

        this.uploading = true;

        req({
            endpoint: '/image',
            method: 'POST',
            data: buf ? buf : this.image,
            config: _.partial(addProgress, self),
            serialize: buf ? serializePassthrough : serializeArrayBufferView
        }).then(function(data) {
            this.progress = null;
            this.uploading = false;

            if (data.ok && data.image) {
                this.preview(null);
                this.buffer(null);
                this.image = null;
                this.mime = null;

                this.click(data.image);

                if (this.userImages()) {
                    this.userImages().unshift(data.image);
                }
            }
        }.bind(this), function(data) {
            this.progress = null;
            this.uploading = false;

            if (data.error) {
                this.error = data.error;
            } else if (data.statusCode == 413) {
                this.error = 'Image file is too large.';
            }
        }.bind(this));
    },
    loadUser: function() {
        if (this.loadingUser) return;
        this.loadingUser = true;

        req({
            endpoint: '/images?page=' + this.userPage()
        }).then(function(data) {
            this.userImages(data.images);
            this.userResults(data.total_results);
            this.userPerPage(data.results_per_page);
            this.loadingUser = false;
        }.bind(this), function(data) {
            this.loadingUser = false;
        }.bind(this));
    }
};

var userConfig = function(vm, el, isInitialized) {
    if (isInitialized) return;

    $(el).on('show.bs.tab', function() {
        vm.loadUser();
    });
};

var setupTab = function(el, isInitialized) {
    if (isInitialized) return;
    $(el).tab('show');
};

var repage = function(page) {
    this.userPage(page);
    this.loadUser();
};

var view = function(vm) {
    var userImages = vm.userImages(),
        preview = vm.preview();

    return m('.modal-content.images-modal', [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: close }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Choose an image')
        ]),
        m('.modal-body', [
            m('ul.nav.nav-tabs', [
                m('li.nav-item', m('a.nav-link[href=#yourimages]', { 'data-toggle': 'tab', config: _.partial(userConfig, vm) }, 'Your Images')),
                m('li.nav-item', m('a.nav-link[href=#uploadimage]', { 'data-toggle': 'tab', config: setupTab }, 'Upload Image'))
            ]),
            m('.tab-content', [
                m('.tab-pane#yourimages', userImages ?
                    m('.card-deck', _.map(userImages, function(img) {
                        return m('a.card', {
                            href: 'javascript:;',
                            style: { width: '200px', flex: 'none' },
                            onclick: vm.click.bind(vm, img)
                        }, [
                            m('img.card-img-top', { src: config.apiRoot + '/image/' + img.id + '/200/0', width: 200, height: (200 * (img.height / img.width)) }),
                            m('.card-block', [
                                m('p.card-text', img.name)
                            ])
                        ]);
                    })) :
                    m('i.fa.fa-spinner.fa-pulse'),
                    vm.userResults() > 0 ? pagination(repage.bind(vm), vm.userPage(), vm.userResults(), vm.userPerPage()) : [],
                    m('.clearfix')
                ),
                m('.tab-pane#uploadimage', [
                    m('.choose', [
                        m('label.file', [
                            m('input#imagefile[type=file]', { onchange: _.partial(vm.loadPreview, vm) }),
                            m('span.file-custom')
                        ])
                    ]),
                    vm.error ? m('.alert.alert-danger', vm.error) : [],
                    preview ? (vm.mime == 'image/gif' ?
                        m('img', { src: preview }) :
                        m.component(crop, { src: preview, buffer: vm.buffer, preview: vm.preview })
                    ) : [],
                    vm.progress ? m('progress.progress.progress-info', { value: vm.progress, max: 1 }, (vm.progress * 100) + '%') : [],
                    m('button.btn.btn-primary', {
                        className: vm.uploading ? 'disabled' : '',
                        onclick: vm.upload.bind(vm)
                    }, vm.uploading ? m('i.fa.fa-spinner.fa-pulse') : 'Upload Image')
                ])
            ])
        ]),
        m('.modal-footer', [
            m('button.btn.btn-secondary', { onclick: close }, 'Cancel')
        ])
    ]);
};

module.exports = function(opts) {
    return modal(model, view, opts, { className: 'modal-lg' });
};
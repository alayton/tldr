var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../views/layout/skeleton.js');
var auth = require('../auth.js');
var req = require('../../util/request.js');

var vm = function(select, catg) {
    this.select = select;
    this.category = catg;
    this.preview = null;
    this.image = null;
    this.error = null;
    this.progress = null;
    this.uploading = false;

    this.categoryImages = m.prop(null);
    this.userImages = m.prop(null);

    this.loadingCategory = false;
    this.loadingUser = false;
};

var serializeReader = function(data) {
    return new Int8Array(data);
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

vm.prototype = {
    closeModal: function() {
        $('#imagesModal').modal('hide');
    },
    click: function(self, img, e) {
        if (e) {
            e.preventDefault();
        }

        self.select(img);
        self.closeModal();
        return false;
    },
    loadPreview: function(self, e) {
        self.preview = self.image = null;
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

        reader.onload = function() {
            self.preview = reader.result;

            var bufReader = new FileReader();
            bufReader.onload = function() {
                self.image = bufReader.result;
                m.redraw();
            };
            bufReader.readAsArrayBuffer(file);
        };

        reader.readAsDataURL(file);
    },
    upload: function(self, e) {
        e.preventDefault();
        if (self.uploading) {
            return;
        }

        if (!self.image) {
            self.error = 'No image selected.';
            return;
        }

        self.uploading = true;

        req({
            endpoint: '/image',
            method: 'POST',
            data: self.image,
            config: _.partial(addProgress, self),
            serialize: serializeReader
        }).then(function(data) {
            self.progress = null;
            self.uploading = false;

            if (data.ok && data.image) {
                self.click(self, data.image);

                if (self.userImages()) {
                    self.userImages().unshift(data.image);
                }
            }
        }, function(data) {
            self.progress = null;
            self.uploading = false;

            if (data.error) {
                self.error = data.error;
            } else if (data.statusCode == 413) {
                self.error = 'Image file is too large.';
            }
        });
    },
    loadCategory: function() {
        var self = this;

        if (self.loadingCategory || self.categoryImages()) {
            return;
        }

        self.loadingCategory = true;

        if (this.category) {
            req({
                endpoint: '/images?catg=' + this.category
            }).then(function(data) {
                self.categoryImages(data.images);
                self.loadingCategory = false;
            }, function(data) {
                self.loadingCategory = false;
            });
        }
    },
    loadUser: function() {
        var self = this;

        if (self.loadingUser || self.userImages()) {
            return;
        }

        self.loadingUser = true;

        req({
            endpoint: '/images'
        }).then(function(data) {
            self.userImages(data.images);
            self.loadingUser = false;
        }, function(data) {
            self.loadingUser = false;
        });
    }
};

module.exports = vm;
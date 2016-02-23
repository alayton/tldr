var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var layout = require('../../views/layout/skeleton.js');
var auth = require('../auth.js');
var req = require('../../util/request.js');

var vm = function(select, catg) {
    this.select = select;
    this.category = catg;

    this.categoryImages = m.prop(null);
    this.userImages = m.prop(null);

    this.loadingCategory = false;
    this.loadingUser = false;
};

var serializeReader = function(data) {
    return new Int8Array(data);
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
    upload: function(self, e) {
        e.preventDefault();

        var files = $('#imagefile')[0].files;
        if (!files.length) {
            return;
        }

        var file = files[0],
            reader = new FileReader();

        reader.onload = function() {
            req({
                endpoint: '/image',
                method: 'POST',
                data: reader.result,
                serialize: serializeReader
            }).then(function(data) {
                if (data.ok && data.image) {
                    self.click(self, data.image);

                    if (self.userImages()) {
                        self.userImages().unshift(data.image);
                    }
                }
            });
        };
        reader.readAsArrayBuffer(file);
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
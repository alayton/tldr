var m = require('mithril');
var _ = require('underscore');

var vm = function(src, bufferCb, previewCb) {
    this.update(src);
    this.buffer = bufferCb;
    this.preview = previewCb;

    this.cursor = null;
    this.action = null;

    this.cropping = null;
    this.cropped = null;
    this.constraint = m.prop(null);
};

vm.prototype = {
    init: function() {
        this.loaded = true;
        this.updateCanvas();
    },
    update: function(src) {
        this.loaded = false;
        this.image = new Image();
        this.image.onload = _.bind(this.init, this);
        this.image.src = src;

        this.mime = src.split(',')[0].split(':')[1].split(';')[0];
    },
    updateCanvas: function(el) {
        if (!el && !this.canvas) {
            return;
        }
        if (el) {
            this.canvas = el;
            this.ctx = this.canvas.getContext('2d');
        }
        if (!this.loaded) {
            return;
        }

        this.imageAspect = this.image.width / this.image.height;

        this.canvas.style.width = '100%';
        this.width = Math.min(this.canvas.offsetWidth, this.image.width);
        this.height = this.width / this.imageAspect;

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = this.width + 'px';
        this.canvas.style.height = this.height + 'px';

        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
        this.ctx.save();
        if (this.cropped) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.rect(this.cropped.x, this.cropped.y, this.cropped.width, this.cropped.height);
            this.ctx.clip();
            this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
        } else if (this.cropping) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            this.ctx.rect(this.cropping.x, this.cropping.y, this.cropping.width, this.cropping.height);
            this.ctx.clip();
            this.ctx.drawImage(this.image, 0, 0, this.width, this.height);
        }
        this.ctx.restore();
    },
    crop: function(e) {
        if (e) e.preventDefault();
        if (!this.cropped) return;

        var ratio = this.image.width / this.width;
        var x = this.cropped.x * ratio,
            y = this.cropped.y * ratio,
            w = this.cropped.width * ratio,
            h = this.cropped.height * ratio;

        var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(this.image, x, y, w, h, 0, 0, w, h);
        var src = canvas.toDataURL(this.mime);
        this.update(src);

        this.preview(src);

        var byteString = atob(src.split(',')[1]),
            ab = new ArrayBuffer(byteString.length),
            ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        this.buffer(ia);
        this.cropped = null;
    }
};

module.exports = vm;
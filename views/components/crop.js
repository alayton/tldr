var m = require('mithril');
var _ = require('underscore');

var mousedown = function(vm, action, e) {
    if (e.button != 0) return;

    vm.cursor = { x: e.clientX, y: e.clientY };
    vm.action = action;

    if (vm.cropped && vm.action == 'move') {
        var rect = vm.canvas.getBoundingClientRect();
        vm.offset = {
            x: (e.clientX - rect.left) - vm.cropped.x,
            y: (e.clientY - rect.top) - vm.cropped.y
        };
    } else if (vm.cropped && vm.action == 'crop') {
        vm.cropped = null;
        m.redraw();
    }

    var mousemove = function(e) {
        var rect = vm.canvas.getBoundingClientRect(),
            aspect = {tag: 6 / 5, guide: 4 / 3}[vm.constraint()];

        if (vm.cropped && vm.action != 'crop') {
            if (vm.action.indexOf('top') >= 0) {
                var dy = (e.clientY - rect.top) - vm.cropped.y;
                vm.cropped.y = e.clientY - rect.top;
                vm.cropped.height -= dy;
                if (aspect) vm.cropped.width = vm.cropped.height * aspect;
            } else if (vm.action.indexOf('bottom') >= 0) {
                var height = (e.clientY - rect.top) - vm.cropped.y;
                if (height < 0) {
                    vm.cropped.y = vm.cropped.y + height;
                    vm.cropped.height = -height;
                } else {
                    vm.cropped.height = height;
                }
                if (aspect) vm.cropped.width = vm.cropped.height * aspect;
            }

            if (vm.action.indexOf('left') >= 0) {
                var dx = (e.clientX - rect.left) - vm.cropped.x;
                vm.cropped.x = e.clientX - rect.left;
                vm.cropped.width -= dx;
            } else if (vm.action.indexOf('right') >= 0) {
                var width = (e.clientX - rect.left) - vm.cropped.x;
                if (width < 0) {
                    vm.cropped.x = vm.cropped.x + width;
                    vm.cropped.width = -width;
                } else {
                    vm.cropped.width = width;
                }
            }

            if (vm.action == 'move') {
                vm.cropped.x = (e.clientX - rect.left) - vm.offset.x;
                vm.cropped.y = (e.clientY - rect.top) - vm.offset.y;
            }
        } else if (vm.action == 'crop') {
            var x = e.clientX - rect.left,
                y = e.clientY - rect.top,
                ox = vm.cursor.x - rect.left,
                oy = vm.cursor.y - rect.top;

            if (!vm.cropping) {
                vm.cropping = {};
            }

            if (x < ox) {
                vm.cropping.x = x;
                vm.cropping.width = ox - x;
            } else {
                vm.cropping.x = ox;
                vm.cropping.width = x - ox;
            }
            if (y < oy) {
                vm.cropping.y = y;
                vm.cropping.height = oy - y;
            } else {
                vm.cropping.y = oy;
                vm.cropping.height = y - oy;
            }

        }

        var crop = vm.cropping ? vm.cropping : vm.cropped;
        if (crop) {
            crop.x = Math.max(0, crop.x);
            crop.y = Math.max(0, crop.y);
            crop.width = Math.min(vm.width - crop.x, crop.width);
            crop.height = Math.min(vm.height - crop.y, crop.height);

            if (aspect) {
                var cropHeight = crop.width / aspect;
                if (cropHeight > vm.height - crop.y) {
                    crop.width = crop.height * aspect;
                } else {
                    crop.height = cropHeight;
                }
            }
        }

        m.redraw();
    };

    var mouseup = function() {
        vm.cursor = null;
        vm.action = null;

        if (vm.cropping) {
            vm.cropped = vm.cropping;
            vm.cropping = null;
        }

        m.redraw();

        document.removeEventListener('mouseup', mouseup, true);
        document.removeEventListener('mousemove', mousemove, true);
    };

    document.addEventListener('mouseup', mouseup, true);
    document.addEventListener('mousemove', mousemove, true);
};

var uncrop = function(vm, e) {
    e.preventDefault();
    vm.cropped = null;
};

var canvasConfig = function(vm, el, isInitialized) {
    vm.updateCanvas(isInitialized ? null : el);
};

module.exports = function(vm) {
    if (vm.cropped) {
        var left = vm.cropped.x + 'px',
            right = (vm.cropped.x + vm.cropped.width) + 'px',
            top = vm.cropped.y + 'px',
            bottom = (vm.cropped.y + vm.cropped.height) + 'px',
            width = vm.cropped.width + 'px',
            height = vm.cropped.height + 'px';
    }

    var constraint = vm.constraint();

    return m('.image-crop', [
        m('.crop-container', [
            m('canvas', { config: _.partial(canvasConfig, vm) }),
            m('.overlays', { style: { width: vm.width + 'px', height: vm.height + 'px' } }, [
                m('.crop', { onmousedown: _.partial(mousedown, vm, 'crop') }),
                !vm.cropping && vm.cropped ? [
                    m('.move', { onmousedown: _.partial(mousedown, vm, 'move'), style: { top: top, left: left, width: width, height: height } }),
                    m('.left', { onmousedown: _.partial(mousedown, vm, 'left'), style: { top: top, left: left, height: height } }),
                    m('.right', { onmousedown: _.partial(mousedown, vm, 'right'), style: { top: top, left: right, height: height } }),
                    m('.top', { onmousedown: _.partial(mousedown, vm, 'top'), style: { top: top, left: left, width: width } }),
                    m('.bottom', { onmousedown: _.partial(mousedown, vm, 'bottom'), style: { top: bottom, left: left, width: width } }),
                    m('.topleft', { onmousedown: _.partial(mousedown, vm, 'top left'), style: { top: top, left: left } }),
                    m('.botright', { onmousedown: _.partial(mousedown, vm, 'bottom right'), style: { top: bottom, left: right } }),
                    m('.topright', { onmousedown: _.partial(mousedown, vm, 'top right'), style: { top: top, left: right } }),
                    m('.botleft', { onmousedown: _.partial(mousedown, vm, 'bottom left'), style: { top: bottom, left: left } })
                ] : []
            ])
        ]),
        m('.controls', [
            vm.cropped ? [
                m('button.btn.btn-danger', { onclick: _.partial(uncrop, vm) }, [m('i.fa.fa-times'), ' Cancel']),
                m('button.btn.btn-success', { onclick: vm.crop.bind(vm) }, [m('i.fa.fa-check'), ' Crop'])
            ] : []
        ]),
        m('.constraints.btn-group', { 'data-toggle': 'buttons' }, [
            m('label.btn.btn-secondary', { onclick: _.partial(vm.constraint, null), className: constraint ? '' : 'active' }, [
                m('input[type=radio]', { name: 'aspect', checked: constraint == null, autocomplete: 'off' }), 'Unconstrained'
            ]),
            m('label.btn.btn-secondary', { onclick: _.partial(vm.constraint, 'guide'), className: constraint == 'guide' ? 'active' : '' }, [
                m('input[type=radio]', { name: 'aspect', checked: constraint == 'guide', autocomplete: 'off' }), 'Guide (4:3)'
            ]),
            m('label.btn.btn-secondary', { onclick: _.partial(vm.constraint, 'tag'), className: constraint == 'tag' ? 'active' : '' }, [
                m('input[type=radio]', { name: 'aspect', checked: constraint == 'tag', autocomplete: 'off' }), 'Tag (6:5)'
            ])
        ])
    ]);
};
var $ = require('jquery');
var config = require('../../config.js');

module.exports = function(vm, title) {
    vm.title = title || null;

    if (!global.window) {
        return;
    }

    var el = $('title');
    el.text((vm.title ? vm.title + ' - ' : '') + 'TLDR.gg');
};
var $ = require('jquery');
var config = require('config');

module.exports = function(vm, url) {
    if (!url) {
        vm.ogImage = config.appRoot + '/asset/img/tldr-logo.png';
    } else {
        if (url.charAt(0) == '/') {
            vm.ogImage = config.appRoot + url;
        } else {
            vm.ogImage = url;
        }
    }

    if (!global.window) {
        return;
    }

    var meta = $('#og-image');
    if (meta && meta.length > 0) {
        meta.attr('content', vm.ogImage);
    } else {
        $('head').append($('<meta>', { id: 'og-image', property: 'og:image', content: vm.ogImage }));
    }
};
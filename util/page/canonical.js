var $ = require('jquery');
var config = require('../../config.js');

module.exports = function(vm, url) {
    if (!url) {
        vm.canonical = null;
    } else {
        vm.canonical = config.appRoot + url;
    }

    if (!global.window) {
        return;
    }

    var link = $('#canon');
    if (url) {
        if (link && link.length > 0) {
            link.attr('href', vm.canonical);
        } else {
            $('head').append($('<link>', { id: 'canon', rel: 'canonical', href: vm.canonical }));
        }
    } else if (link && link.length > 0) {
        link.detach();
    }
};
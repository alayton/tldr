var $ = require('jquery');
var config = require('../../config.js');

var canonical = function(url) {
    if (!url) {
        canonical.current = null;
    } else {
        canonical.current = config.appRoot + url;
    }

    if (!global.window) {
        return;
    }

    var link = $('#canon');
    if (url) {
        if (link && link.length > 0) {
            link.attr('href', canonical.current);
        } else {
            $('head').append($('<link>', { id: 'canon', rel: 'canonical', href: canonical.current }));
        }
    } else if (link && link.length > 0) {
        link.detach();
    }
};

canonical.current = null;

module.exports = canonical;
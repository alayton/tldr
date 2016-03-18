var $ = require('jquery');

module.exports = function(title) {
    if (!global.window) {
        return;
    }

    var $title = $('title');
    if (title) {
        $title.text(title + ' - TLDR.gg');
    } else {
        $title.text('TLDR.gg');
    }
};
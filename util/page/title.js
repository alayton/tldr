var $ = require('jquery');

var title = function(text) {
    if (text) {
        text += ' - TLDR.gg';
    } else {
        text = 'TLDR.gg';
    }

    title.current = text;

    if (!global.window) {
        return;
    }

    $('title').text(text);
};

title.current = null;

module.exports = title;
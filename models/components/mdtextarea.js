var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');

var vm = function(val) {
    this.val = val;
};

var getTextarea = function(el) {
    return $(el).parent().parent().find('textarea');
};

vm.prototype = {
    bold: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('**', '**');
    },
    italic: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('_', '_');
    },
    strikethrough: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('~~', '~~');
    },
    header: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('### ', '');
    },
    link: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('[', '](http://)');
    },
    blockquote: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        var sel = area.getSelection();
        var newText = '> ' + sel.text.replace(/\n/gm, '\n> ');
        if (sel.start > 0) {
            var text = area.val();
            if (text.charAt(sel.start - 1) != '\n') {
                newText = '\n' + newText;
            }
        }
        area.replaceSelectedText(newText);
    },
    ul: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        var sel = area.getSelection();
        if (sel.length > 0) {
            var lines = sel.text.split('\n');
            lines = _.map(lines, function(line) {
                return '* ' + line.trim();
            });
            area.replaceSelectedText(lines.join('\n'));
        } else {
            area.replaceSelectedText('* ');
        }
    },
    ol: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        var sel = area.getSelection();
        if (sel.length > 0) {
            var lines = sel.text.split('\n');
            lines = _.map(lines, function(line, idx) {
                return (idx + 1) + '. ' + line.trim();
            });
            area.replaceSelectedText(lines.join('\n'));
        } else {
            area.replaceSelectedText('1. ');
        }
    },
    hr: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.replaceSelectedText('---\n');
    },
    tt: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('`', '`');
    },
    code: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('```\n', '\n```');
    },
    table: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        area.surroundSelectedText('', '| Header\n------ | ------\nContent | Context');
    }
};

module.exports = vm;
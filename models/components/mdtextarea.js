var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');

var vm = function(val) {
    this.val = val;
};

var getTextarea = function(el) {
    return $(el).parent().siblings('textarea');
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
            area.surroundSelectedText('* ', '\n* ');
        } else {
            area.replaceSelectedText('* ');
        }
    },
    ol: function(e) {
        e.preventDefault();
        var area = getTextarea(this).focus();
        var sel = area.getSelection();
        if (sel.length > 0) {
            area.surroundSelectedText('1. ', '\n2. ');
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
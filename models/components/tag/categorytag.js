var m = require('mithril');
var $ = require('jquery');
var _ = require('underscore');
var Sifter = require('sifter');
var req = require('../../../util/request.js');

var vm = function(tag, addFunc, context, onclick) {
    this.tag = tag;
    this.addFunc = addFunc;
    this.context = context;
    this.onclick = onclick;

    this.sifter = null;
    this.children = m.prop(null);
    this.filteredChildren = m.prop([]);
    this.search = m.prop('');
};

vm.prototype = {
    showChildren: function(self, e) {
        e.preventDefault();

        if (self.children() === null) {
            req({
                endpoint: '/tag/children/' + self.tag.id
            }, true).then(function(data) {
                self.children(data.children);
                self.sifter = new Sifter(self.children());
            });
        }

        var $this = $(this),
            popover = $this.next('.popover');

        popover.css({ left: $this.position().left + 'px' }).toggle();

        return false;
    },
    addTag: function(tag) {
        var addFunc = _.bind(this.addFunc, this.context, tag);
        if (this.onclick) {
            return addFunc;
        } else {
            return addFunc();
        }
    }
};

module.exports = vm;
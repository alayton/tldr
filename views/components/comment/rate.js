var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var numeral = require('numeral');
var auth = require('models/auth.js');

var onLike = function(vm, e) {
    if (!auth.user()) {
        $('#loginModal').modal('show');
    } else {
        var rating = vm.parent.ratings && vm.parent.ratings[vm.comment.id] ? 0 : 1;
        vm.rate(rating);
    }
};

module.exports = function(vm) {
    var c = vm.comment,
        rated = vm.parent.ratings && vm.parent.ratings[c.id];

    return m('a.thumb[href=javascript:;]', {
        className: rated ? 'up' : '',
        onclick: vm.comment.id ? _.partial(onLike, vm) : undefined
    }, [m('i.fa.fa-thumbs-o-up'), m('span', { title: c.rating }, numeral(c.rating).format('0a'))]);
};
var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var numeral = require('numeral');
var auth = require('../../../models/auth.js');

var onLike = function(vm, e) {
    if (!auth.user()) {
        $('#loginModal').modal('show');
    } else {
        var rating = vm.parent.ratings && vm.parent.ratings[vm.guide.id] ? 0 : 1;
        vm.rate(rating);
    }
};

module.exports = function(vm) {
    var g = vm.guide,
        rated = vm.parent.ratings && vm.parent.ratings[g.id];

    return m('a.likeguide[href=javascript:;]', {
        className: rated ? 'liked' : '',
        onclick: vm.guide.id ? _.partial(onLike, vm) : undefined
    }, [m('i.fa.fa-thumbs-o-up'), m('span', { title: g.rating }, numeral(g.rating).format('0a'))]);
};
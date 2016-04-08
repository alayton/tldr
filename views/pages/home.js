var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var layout = require('views/layout/sidebar.js');
var tagCard = require('views/components/tag/tag.js');
var guideList = require('views/components/guide/list.js');

module.exports = function(vm) {
    return layout([
        m('.tag-search', [
            m('i.fa.fa-search'),
            m('input[type=text].form-control', { placeholder: 'Search for a game...', oninput: m.withAttr('value', vm.search.bind(vm)), value: vm.tagSearch })
        ]),
        m('h3', 'Categories'),
        m('.card-deck', _.map(vm.shownTags, tagCard)),
        vm.tagSearch || !vm.moreTags ? [] : m('.show-more', [
            m('hr'),
            m('button[type=button].btn', { onclick: vm.showMore.bind(vm) }, ['Show More ', m('i.fa.fa-arrow-down')])
        ]),
        m('h3', 'Hot Guides'),
        guideList(vm, vm.guides, { category: true })
    ], 'home');
};
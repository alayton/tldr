var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');
var tagCard = require('views/components/tag/tag.js');

module.exports = function(vm) {
    return layout([
        m('.card-deck', [
            _.map(vm.tags, tagCard),
            auth.isPrivileged() ? m('.card.card-tag', [
                m('a',  {
                    href: '/tag/new/' + vm.tag.id + '-' + slug(vm.tag.name),
                    config: m.route
                }, m('img.card-img-top', { src: '/asset/img/add.png' })),
                m('a.card-block', {
                    href: '/tag/new/' + vm.tag.id + '-' + slug(vm.tag.name),
                    config: m.route
                }, m('h4.card-title', 'Create Tag'))
            ]) : []
        ])
    ]);
};
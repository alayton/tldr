var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var layout = require('../layout/sidebar.js');

module.exports = function(vm) {
    return layout([
        m('h1', 'TLDR.gg'),
        m('.card-deck', _.map(vm.tags, function(tag) {
            return m('a.card', {
                href: tag.leaf || tag.allow_leafs ?
                    '/guides/' + tag.id + '-' + slug(tag.name) :
                    '/tags/' + tag.id + '-' + slug(tag.name),
                style: { width: '242px', flex: 'none' },
                config: m.route
            }, [
                m('img.card-img-top', { src: 'http://lorempixel.com/240/200/cats/' + ((tag.id % 10) + 1) + '/', height: 200 }),
                m('.card-block', m('h4.card-title', tag.name))
            ]);
        }))
    ]);
};
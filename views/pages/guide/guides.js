var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var layout = require('../../layout/sidebar.js');
var categoryTag = require('../../../controllers/components/categorytag.js');

module.exports = function(vm) {
    return layout([
        m('.tags.current-tags', _.map(vm.tags, function(tag) {
            return tag.id == vm.category.id ?
                null :
                m('a.tag.current', {
                    href: vm.removeTag(tag),
                    config: m.route
                }, [
                    m('i.fa.fa-times'), tag.name
                ]);
        })),
        m('.tags.add-tags', _.map(vm.childTags, function(tag) {
            return vm.hasTag(tag) ?
                null :
                tag.leaf ?
                    m('a.tag', {
                        href: vm.addTag(tag),
                        config: m.route
                    }, [
                        m('i.fa.fa-plus'), tag.name
                    ]) :
                    m.component(categoryTag, { tag: tag, addFunc: vm.addTag, context: vm });
        })),
        m('h4', 'Guides'),
        m('.card-deck.guides', _.map(vm.guides, function(guide) {
            return m('a.card', {
                href: '/guide/' + guide.id + '-' + slug(guide.title),
                style: { width: '242px', flex: 'none' },
                config: m.route
            }, [
                m('img.card-img-top', { src: 'http://lorempixel.com/240/200/cats/' + ((guide.id % 10) + 1) + '/', height: 200 }),
                m('.card-block', [
                    m('h4.card-title', guide.title),
                    m('p.card-text', guide.author_name)
                ])
            ]);
        }))
    ]);
};
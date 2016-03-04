var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');
var categoryTag = require('../../../controllers/components/tag/categorytag.js');

module.exports = function(vm) {
    return layout([
        m('.category-header', [
            m('a.btn.btn-success.new-guide', {
                href: '/guide/edit?catg=' + vm.category.id,
                config: m.route
            }, [m('i.fa.fa-plus'), ' New Guide']),
            m('h2', vm.category.name),
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
            }))
        ]),
        m('.card-deck.guides', _.map(vm.guides, function(guide) {
            return m('a.card', {
                href: '/guide/' + guide.id + '-' + slug(guide.title),
                style: { width: '242px', flex: 'none' },
                config: m.route
            }, [
                m('img.card-img-top', {
                    src: 'http://lorempixel.com/240/200/cats/' + ((guide.id % 10) + 1) + '/',
                    height: 200
                }),
                m('.card-block', [
                    m('h4.card-title', guide.title),
                    m('p.card-text.author', [
                                      m('i.fa.fa-user'),
                                      guide.author_name
                                      ])
                ])
            ]);
        }))

    ]);
};
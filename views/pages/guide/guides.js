var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('../../../models/auth.js');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');
var categoryTag = require('../../../controllers/components/tag/categorytag.js');

module.exports = function(vm) {
    return layout([
        m('.category-header', [
            auth.user() ? m('a.btn.btn-success.new-guide', {
                href: '/guide/new/' + vm.category.id,
                config: m.route
            }, [m('i.fa.fa-plus'), ' New Guide']) : [],
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
        m('.guides', _.map(vm.guides, function(g) {
            var url = '/guide/' + g.id + '-' + slug(g.title);
            return m('.guide', [
                m('a', { href: url, config: m.route }, m('img', {
                    src: g.image_id ? imageurl(g.image_id, 160, 120) : '/asset/img/guide-ph.png',
                    width: 160,
                    height: 120
                })),
                m('.contents', [
                    m('a', { href: url, config: m.route }, m('h3', g.title)),
                    m('var', ['Last updated ', m('abbr', { title: moment(g.edited).format('lll') }, moment(g.edited).fromNow())]),
                    m('span', [m('i.fa.fa-user'), g.author_name])
                ])
            ]);
        }))
    ]);
};
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var auth = require('../../../models/auth.js');
var imageurl = require('../../../util/imageurl.js');

module.exports = function(tag) {
    return m('.card.card-tag', [
        m('a',  {
            href: tag.leaf || tag.allow_leafs ?
            '/guides/' + tag.id + '-' + slug(tag.name) :
            '/tags/' + tag.id + '-' + slug(tag.name),
            config: m.route
        }, m('img.card-img-top', {
            src: tag.image_id ?
                imageurl(tag.image_id, 240, 200) :
                '/asset/img/guide-ph.png'
        })),
        m('a.card-block', {
            href: tag.leaf || tag.allow_leafs ?
            '/guides/' + tag.id + '-' + slug(tag.name) :
            '/tags/' + tag.id + '-' + slug(tag.name),
            config: m.route
        }, m('h4.card-title', tag.name)),
        auth.isPrivileged() ? m('ul.popup', m('li', [
            m('i.fa.fa-gear'),
            m('ul', [
                m('li', m('a', {
                    href: '/tag/edit/' + tag.id + '-' + slug(tag.name),
                    config: m.route
                }, [
                    m('i.fa.fa-tag'),
                    'Edit tag'
                    ]))
            ])
        ])) : []
    ]);
};
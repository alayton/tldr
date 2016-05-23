var $ = require('jquery');
var m = require('mithril');
var slug = require('slug');
var auth = require('models/auth.js');
var imageurl = require('util/imageurl.js');

var showLogin = function() {
    $('#loginModal').modal('show');
};

module.exports = function(tag) {
    return m('.card.card-tag', [
        m('.cover', [
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
            m('ul', [
                m('li', m('a.btn.btn-sm.btn-block.btn-primary', {
                    href: tag.leaf || tag.allow_leafs ?
                    '/guides/' + tag.id + '-' + slug(tag.name) :
                    '/tags/' + tag.id + '-' + slug(tag.name),
                    config: m.route
                }, [m('i.fa.fa-arrow-right'), ' View Guides'])),
                m('li', auth.user() ?
                    m('a.btn.btn-sm.btn-block.btn-success', {
                        href: '/guide/new/' + tag.id + '-' + slug(tag.name),
                        config: m.route
                    }, [m('i.fa.fa-plus'), ' Create Guide']) :
                    m('a.btn.btn-sm.btn-block.btn-success[href=javascript:;]', {
                        onclick: showLogin
                    }, [m('i.fa.fa-plus'), ' Create Guide'])
                ),
                auth.isPrivileged() ?
                    m('li', m('a.btn.btn-sm.btn-block.btn-secondary', {
                        href: '/tag/edit/' + tag.id + '-' + slug(tag.name),
                        config: m.route
                    }, [m('i.fa.fa-tag'), ' Edit tag'])) : []
            ])
        ]),
        m('a.card-block', {
            href: tag.leaf || tag.allow_leafs ?
            '/guides/' + tag.id + '-' + slug(tag.name) :
            '/tags/' + tag.id + '-' + slug(tag.name),
            config: m.route
        }, m('h4.card-title', tag.name))
    ]);
};
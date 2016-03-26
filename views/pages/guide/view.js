var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('../../../models/auth.js');
var imageurl = require('../../../util/imageurl.js');
var romanize = require('../../../util/romanize.js');
var layout = require('../../layout/sidebar.js');

var md = require('markdown-it')()
    .disable(['image']);

module.exports = function(vm) {
    if (vm.guide) {
        var catg = vm.guide.category;
    }

    return layout(vm.guide === false ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        [
            m('.guide-header.clearfix', [
                m('.guide-image', [
                    vm.guide.image_id ? m('img', { src: imageurl(vm.guide.image_id, 160, 120) }) : [],
                ]),
                m('.guide-title', [
                    auth.isUser(vm.guide.user_id) || auth.isPrivileged() ? m('a.btn.btn-info.pull-right', {
                        href: '/guide/edit/' + vm.guide.id + '-' + slug(vm.guide.title), config: m.route
                    }, 'Edit') : [],
                    m('h2', vm.guide.title),
                    m('span.author', [
                        'By ',
                        m('a', { href: '/search?q=' + vm.guide.author_name, config: m.route }, vm.guide.author_name)
                    ]),
                    m('span.updated', ['Last updated ', m('abbr', { title: moment(vm.guide.edited).format('lll') }, moment(vm.guide.edited).fromNow())]),
                    m('.tags', [
                        m('a.tag.category', {
                            href: '/guides/' + catg.id + '-' + slug(catg.name),
                            config: m.route
                        }, vm.guide.category.name),
                        _.map(vm.guide.tags, function(tag) {
                            return m('a.tag', {
                                href: '/guides/' + catg.id + '-' + slug(catg.name) + '/' + tag.id + '-' + slug(tag.name),
                                config: m.route
                            }, tag.name);
                        })
                    ])
                ])
            ]),
            m('.guide-body', _.map(vm.body, function(section, idx) {
                var img = section.image,
                    imgWidth = img ? Math.min(800, img.width) : 0;

                return m('section.clearfix', [
                    m('header', romanize(idx + 1)),
                    m('article', [
                        m.trust(md.render(section.text)),
                        img ?
                            m('.image', m('img', { src: imageurl(img.id, imgWidth), style: { maxWidth: imgWidth + 'px' } })) :
                            []
                    ])
                ]);
            }))
        ]
    );
};
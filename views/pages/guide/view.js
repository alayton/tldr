var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var imageurl = require('util/imageurl.js');
var romanize = require('util/romanize.js');
var layout = require('views/layout/sidebar.js');
var rate = require('controllers/components/guide/rate.js');
var guideList = require('views/components/guide/list.js');
var commentList = require('controllers/components/comment/list.js');

var md = require('markdown-it')()
    .disable(['image']);

module.exports = function(vm) {
    var baseUrl = '';
    if (vm.guide) {
        var catg = vm.guide.category;
        baseUrl = '/guide/' + vm.guide.id + '-' + slug(vm.guide.title);
    }

    return layout(vm.guide === false ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        [
            m('.guide-header.clearfix', [
                m.component(rate, { guide: vm.guide, parent: vm }),
                m('.guide-image', [
                    m('img', { src: (vm.guide.image_id ? imageurl(vm.guide.image_id, 160, 120) : '/asset/img/guide-ph.png') })
                ]),
                m('.guide-title', [
                    auth.isUser(vm.guide.user_id) || auth.isPrivileged() ? m('a.btn.btn-info.pull-right', {
                        href: '/guide/edit/' + vm.guide.id + '-' + slug(vm.guide.title), config: m.route
                    }, 'Edit') : [],
                    m('h1', vm.guide.title),
                    m('span.author', [
                        'By ',
                        m('a', { href: '/user/guides/' + vm.guide.user_id + '-' + slug(vm.guide.author_name), config: m.route }, vm.guide.author_name)
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
            })),
            vm.guide.suggestions.length > 0 ? m('.guide-extras', [
                m('section.suggested', [
                    m('h3', 'Suggested Guides'),
                    guideList(vm, vm.guide.suggestions, {
                        category: true
                    })
                ])
            ]) : [],
            m.component(commentList, { guideId: vm.guide.id, baseUrl: baseUrl, params: vm.params })
        ]
    );
};
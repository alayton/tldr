var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var layout = require('../../layout/sidebar.js');

module.exports = function(vm) {
    if (vm.guide) {
        var catg = vm.guide.category;
    }

    return layout(vm.guide === false ?
        m('.alert.alert-danger', vm.error ? vm.error : 'Guide not found!') :
        [
            m('.guide-header', [
                m('a.btn.btn-info.pull-right', {
                    href: '/guide/edit/' + vm.guide.id + '-' + slug(vm.guide.title), config: m.route
                }, 'Edit'),
                m('h2', vm.guide.title),
                m('span.author', [
                    'By ',
                    m('a', { href: '/user/' + vm.guide.user_id + '-' + slug(vm.guide.author_name), config: m.route }, vm.guide.author_name)
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
            ]),
            m('.guide-body', _.map(vm.body, function(section) {
                return m('.section', [
                    m('h3', section.title || 'Section Header'),
                    m('p', section.text)
                ]);
            }))
        ]
    );
};
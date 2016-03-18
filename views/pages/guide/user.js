var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');

module.exports = function(vm) {
    var status = {
        0: ['In Progress', 'warning'],
        1: ['Public', ''],
        2: ['Moderated', 'danger'],
        3: ['Deleted', 'danger']
    };

    return layout([
        m('.category-header', [
            m('h2', vm.user.username + "'s Guides")
        ]),
        vm.guides ?
            vm.guides.length ?
                m('.guides', _.map(vm.guides, function(g) {
                    var url = '/guide/' + g.id + '-' + slug(g.title);
                    return m('.guide', { className: status[g.status][1] }, [
                        m('a', { href: url, config: m.route }, m('img', {
                            src: g.image_id ? imageurl(g.image_id, 160, 120) : '/asset/img/guide-ph.png',
                            width: 160,
                            height: 120
                        })),
                        m('.contents', [
                            m('a', { href: url, config: m.route }, m('h3', g.title)),
                            m('var', ['Last updated ', m('abbr', { title: moment(g.edited).format('lll') }, moment(g.edited).fromNow())]),
                            m('a.tag.category', {
                                href: '/guides/' + g.category_id + '-' + slug(g.category_name),
                                config: m.route
                            }, g.category_name),
                            m('.status', status[g.status][0])
                        ])
                    ]);
                })) :
                m('.guides', m('p', 'No guides yet :('))
            : m('.page-loading', [
                m('h2', m.trust('Loading &hellip;')),
                m('i.fa.fa-spinner.fa-pulse')
            ])
    ]);
};
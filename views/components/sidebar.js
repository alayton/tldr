var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var guideurl = require('util/guideurl.js');

module.exports = function(vm) {
    return m('.activity-feed', [
        m('h3', 'Recent Activity'),
        vm.loaded ?
            _.map(vm.activity, function(a) {
                a.title = a.name;
                if (a.type == 'guide') {
                    return m('.feed-guide', [
                        m('a.title', { href: guideurl(a), config: m.route }, a.name),
                        m('a.tag.category', {
                            href: '/guides/' + a.category_id + '-' + slug(a.category_name),
                            config: m.route
                        }, a.category_name),
                        m('a.user', {
                            href: '/user/guides/' + a.user_id + '-' + slug(a.user_name),
                            config: m.route
                        }, [m('i.fa.fa-user'), ' ', a.user_name]),
                        m('var', ['Updated ', m('abbr', { title: moment(a.when).format('lll') }, moment(a.when).fromNow())])
                    ]);
                } else if (a.type == 'rating') {
                    return m('.feed-rating.clearfix', [
                        m('span.likeguide.liked', [m('i.fa.fa-thumbs-o-up'), m('span', a.value)]),
                        m('div', [
                            m('a.title', { href: guideurl(a), config: m.route }, a.name),
                            m('a.tag.category', {
                                href: '/guides/' + a.category_id + '-' + slug(a.category_name),
                                config: m.route
                            }, a.category_name),
                            m('var', moment(a.when).format('LL'))
                        ])
                    ]);
                } else {
                    return [];
                }
            }) : m('i.loading.fa.fa-spinner.fa-pulse.fa-3x.fa-fw')
    ]);
};
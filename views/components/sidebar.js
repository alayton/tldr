var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var guideurl = require('util/guideurl.js');
var username = require('views/components/user/name.js');

module.exports = function(vm) {
    return m('.activity-feed', [
        m('h3', 'Recent Activity'),
        vm.loaded ?
            _.map(vm.activity, function(a) {
                a.title = a.name;
                if (a.type == 'guide') {
                    return m('.feed-guide', [
                        m('a.title', { href: guideurl(a), config: m.route }, a.name),
                        username(a.user),
                        m('var', ['Updated ', m('abbr', { title: moment(a.when).format('lll') }, moment(a.when).fromNow())]),
                        m('a.tag.category', {
                            href: '/guides/' + a.category_id + '-' + slug(a.category_name),
                            config: m.route
                        }, a.category_name)
                    ]);
                } else if (a.type == 'rating') {
                    return m('.feed-rating.clearfix', [
                        m('a.title', { href: guideurl(a), config: m.route }, a.name),
                        m('var', [
                            m('span', '+' + a.value + ' thumb' + (a.value > 1 ? 's' : '')),
                            ' on ',
                            moment(a.when).format('LL')
                        ]),
                        m('a.tag.category', {
                            href: '/guides/' + a.category_id + '-' + slug(a.category_name),
                            config: m.route
                        }, a.category_name)
                    ]);
                } else if (a.type == 'comment') {
                    return m('.feed-comment.clearfix', [
                        m('a.title', { href: guideurl(a), config: m.route }, a.name),
                        m('var', [
                            m('span', a.value + ' comment' + (a.value > 1 ? 's' : '')),
                            ' on ',
                            moment(a.when).format('LL')
                        ]),
                        m('a.tag.category', {
                            href: '/guides/' + a.category_id + '-' + slug(a.category_name),
                            config: m.route
                        }, a.category_name)
                    ]);
                } else {
                    return [];
                }
            }) : m('i.loading.fa.fa-spinner.fa-pulse.fa-3x.fa-fw')
    ]);
};
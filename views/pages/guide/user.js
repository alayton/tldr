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
        m('.guides', _.map(vm.guides, function(g) {
            var url = '/guide/' + g.id + '-' + slug(g.title);
            return m('.guide', { className: status[g.status][1] }, [
                m('a', { href: url, config: m.route }, m('img', {
                    src: g.image_id ? imageurl(g.image_id, 160, 120) : 'http://lorempixel.com/160/120/cats/' + ((g.id % 10) + 1) + '/',
                    width: 160,
                    height: 120
                })),
                m('a', { href: url, config: m.route }, m('h3', g.title)),
                m('var', ['Last updated ', m('abbr', { title: moment(g.edited).format('lll') }, moment(g.edited).fromNow())]),
                m('span', status[g.status][0])
            ]);
        }))
    ]);
};
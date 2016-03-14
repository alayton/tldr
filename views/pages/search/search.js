var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var imageurl = require('../../../util/imageurl.js');
var layout = require('../../layout/sidebar.js');

module.exports = function(vm) {
    return layout([
        m('.text-muted', [(vm.result.page > 1 ? 'Page ' + vm.result.page + ' of ' : ''), vm.result.total_results, ' results']),
        m('.results', _.map(vm.result.guides, function(g) {
            return m('.guide', [
                m('img', {
                    src: g.image_id ? imageurl(g.image_id, 200, 150) : 'http://lorempixel.com/200/150/cats/' + ((g.id % 10) + 1) + '/',
                    width: 160,
                    height: 120
                }),
                m('h3', g.title),
                m('var', ['Last updated ', m('abbr', { title: moment(g.edited).format('lll') }, moment(g.edited).fromNow())]),
                m('a.tag.category', {
                    href: '/guides/' + g.category_id + '-' + slug(g.category_name),
                    config: m.route
                }, g.category_name),
                m('span', ['By ', g.author_name])
            ]);
        }))
    ]);
};
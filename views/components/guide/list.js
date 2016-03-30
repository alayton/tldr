var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var guideurl = require('../../../util/guideurl.js');
var imageurl = require('../../../util/imageurl.js');
var rate = require('../../../controllers/components/guide/rate.js');

module.exports = function(vm, guides, opts) {
    opts = opts || {};

    return m('.guides', _.map(guides, function(g) {
        var url = guideurl(g);
        return m('.guide', { className: opts.className ? opts.className(g) : '' }, [
            m.component(rate, { guide: g, parent: vm }),
            m('a', { href: url, config: m.route }, m('img', {
                src: g.image_id ? imageurl(g.image_id, 160, 120) : '/asset/img/guide-ph.png',
                width: 160,
                height: 120
            })),
            m('.contents', [
                m('a', { href: url, config: m.route }, m('h3', g.title)),
                m('.left-info', [
                    opts.category ? m('a.tag.category', {
                        href: '/guides/' + g.category_id + '-' + slug(g.category_name),
                        config: m.route
                    }, g.category_name) : [],
                    m('span', [m('i.fa.fa-user'), g.author_name])
                ]),
                m('var', ['Last updated ', m('abbr', { title: moment(g.edited).format('lll') }, moment(g.edited).fromNow())]),
                opts.extra ? opts.extra(g) : []
            ])
        ]);
    }));
};
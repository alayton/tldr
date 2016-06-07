var m = require('mithril');
var _ = require('underscore');

module.exports = function(urlPattern, currentPage, totalResults, perPage) {
    var totalPages = Math.ceil(totalResults / perPage),
        pages = [],
        hasPrevious = currentPage > 1,
        hasNext = currentPage < totalPages,
        i;

    if (!totalResults/* || totalPages == 1*/) {
        return [];
    }

    if (totalPages < 8) {
        for (i = 1; i <= totalPages; ++i) {
            pages.push(i);
        }
    } else if (currentPage <= 4) {
        for (i = 1; i <= 5; ++i) {
            pages.push(i);
        }
        pages.push(null);
        pages.push(totalPages);
    } else if (currentPage + 3 >= totalPages) {
        pages.push(1);
        pages.push(null);
        for (i = totalPages - 4; i <= totalPages; ++i) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        pages.push(null);
        for (i = currentPage - 2; i <= currentPage + 2; ++i) {
            pages.push(i);
        }
        pages.push(null);
        pages.push(totalPages);
    }

    return m('ul.pagination', [
        hasPrevious ?
            m('li.page-item', m('a.page-link', { href: urlPattern.replace('%page%', currentPage - 1), config: m.route }, m('span', m.trust('&laquo;')))) :
            m('li.page-item', m('span.page-link', m('span', m.trust('&laquo;')))),
        _.map(pages, function(page) {
            if (page === null) {
                return m('li.page-item', m('span.page-link', m('span', m.trust('&hellip;'))));
            } else {
                return m('li.page-item',
                    { className: currentPage == page ? 'active' : '' },
                    m('a.page-link', { href: urlPattern.replace('%page%', page), config: m.route }, page)
                );
            }
        }),
        hasNext ?
            m('li.page-item', m('a.page-link', { href: urlPattern.replace('%page%', currentPage + 1), config: m.route }, m('span', m.trust('&raquo;')))) :
            m('li.page-item', m('span.page-link', m('span', m.trust('&raquo;'))))
    ])
};
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');
var guideList = require('views/components/guide/list.js');
var pagination = require('views/components/pagination.js');

module.exports = function(vm) {
    var status = {
            0: ['In Progress', 'warning'],
            1: ['Public', ''],
            2: ['Moderated', 'danger'],
            3: ['Deleted', 'danger']
        },
        url = '/user/guides' + (auth.user() && vm.user.id != auth.user().id ? '/' + vm.user.id : '') + '?page=%page%';

    return layout([
        m('.category-header', [
            m('h1', vm.user.username)
        ]),
        m('ul.nav.nav-pills', [
            m('li.nav-item', m('a.nav-link.active', { config: m.route, href: '/user/guides/' + vm.user.id + '-' + slug(vm.user.username) }, 'Guides')),
            (auth.user() && (auth.user().id == vm.user.id || auth.isPrivileged())) ?
                m('li.nav-item', m('a.nav-link', { config: m.route, href: '/user/images/' + vm.user.id + '-' + slug(vm.user.username) }, 'Images')) :
                []
        ]),
        vm.guides.length ?
            [
                guideList(vm, vm.guides, {
                    category: true,
                    className: function(g) {
                        return status[g.status][1]
                    },
                    extra: function(g) {
                        return m('.status', status[g.status][0]);
                    }
                }),
                vm.pagination ? pagination(url, vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
            ] :
            m('.guides', m('p', 'No guides yet :('))
    ], 'user-guides');
};
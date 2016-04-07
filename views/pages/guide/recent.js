var m = require('mithril');
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
        url = '/recent/guides?' + (vm.unfinished ? 'unfinished=1&' : '') + 'page=%page%';

    return layout([
        m('.category-header', [
            auth.isPrivileged() ?
                m('a.btn.btn-secondary.btn-sm.pull-right',{
                    config: m.route,
                    href: '/recent/guides' + (vm.unfinished ? '' : '?unfinished=1')
                }, (vm.unfinished ? 'Show Public' : 'Show All')) :
                [],
            m('h2', 'Recent Guides')
        ]),
        guideList(vm, vm.guides, vm.unfinished ? {
            className: function(g) {
                return status[g.status][1]
            },
            extra: function(g) {
                return m('.status', status[g.status][0]);
            }
        } : undefined),
        vm.pagination ? pagination(url, vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
    ]);
};
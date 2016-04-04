var m = require('mithril');
var slug = require('slug');
var moment = require('moment');
var layout = require('views/layout/sidebar.js');
var guideList = require('views/components/guide/list.js');
var pagination = require('views/components/pagination.js');

module.exports = function(vm) {
    return layout([
        m('.category-header', [
            m('h2', 'Recent Guides')
        ]),
        guideList(vm, vm.guides),
        vm.pagination ? pagination('/recent/guides' + '?page=%page%', vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
    ]);
};
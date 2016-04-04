var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var layout = require('views/layout/sidebar.js');
var guideList = require('views/components/guide/list.js');
var pagination = require('views/components/pagination.js');

module.exports = function(vm) {
    return layout([
        m('.text-muted', [(vm.result.page > 1 ? 'Page ' + vm.result.page + ' of ' : ''), vm.result.total_results, ' results']),
        guideList(vm, vm.result.guides, {
            category: true
        }),
        pagination('/search?q=' + encodeURIComponent(vm.result.query) + '&page=%page%', vm.result.page, vm.result.total_results, vm.result.results_per_page)
    ]);
};
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var layout = require('../../layout/sidebar.js');
var guideList = require('../../components/guide/list.js');

module.exports = function(vm) {
    return layout([
        m('.text-muted', [(vm.result.page > 1 ? 'Page ' + vm.result.page + ' of ' : ''), vm.result.total_results, ' results']),
        guideList(vm, vm.result.guides, {
            category: true
        })
    ]);
};
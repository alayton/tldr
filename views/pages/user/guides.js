var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');
var guideList = require('views/components/guide/list.js');
var pagination = require('views/components/pagination.js');
var header = require('views/components/user/header.js');

module.exports = function(vm) {
    var status = {
            0: ['In Progress', 'warning'],
            1: ['Public', ''],
            2: ['Moderated', 'danger'],
            3: ['Deleted', 'danger']
        },
        url = '/user/guides/' + vm.user.id + '-' + slug(vm.user.username) + '?page=%page%';

    return layout([
        header(vm.user, 'guides'),
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
var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var layout = require('../../layout/sidebar.js');
var guideList = require('../../components/guide/list.js');

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
        vm.guides ?
            vm.guides.length ?
                guideList(vm, vm.guides, {
                    category: true,
                    className: function(g) {
                        return status[g.status][1]
                    },
                    extra: function(g) {
                        return m('.status', status[g.status][0]);
                    }
                }) :
                m('.guides', m('p', 'No guides yet :('))
            : m('.page-loading', [
                m('h2', m.trust('Loading &hellip;')),
                m('i.fa.fa-spinner.fa-pulse')
            ])
    ]);
};
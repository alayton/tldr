var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');
var guideList = require('views/components/guide/list.js');
var categoryTag = require('controllers/components/tag/categorytag.js');
var pagination = require('views/components/pagination.js');

var showLogin = function() {
    $('#loginModal').modal('show');
};

module.exports = function(vm) {
    return layout([
        m('.category-header', [
            auth.user() ?
                m('a.btn.btn-success.new-guide', {
                    href: '/guide/new/' + vm.category.id + '-' + slug(vm.category.name),
                    config: m.route
                }, [m('i.fa.fa-plus'), ' Create Guide']) :
                m('a.btn.btn-success.new-guide[href=javascript:;]', {
                    onclick: showLogin
                }, [m('i.fa.fa-plus'), ' Create Guide']),
            m('h1', [
                vm.category.name,
                auth.isPrivileged() ? m('a.fa.fa-pencil', { href: '/tag/edit/' + vm.category.id + '-' + slug(vm.category.name), config: m.route }) : []
            ]),
            m('.tags.current-tags', _.map(vm.tags, function(tag) {
                return tag.id == vm.category.id ?
                    null :
                    m('a.tag.current', {
                        href: vm.removeTag(tag),
                        config: m.route
                    }, [
                        m('i.fa.fa-times'), tag.name
                    ]);
            })),
            m('.tags.add-tags', _.map(vm.childTags, function(tag) {
                return vm.hasTag(tag) ?
                    null :
                    tag.leaf ?
                        m('a.tag', {
                            href: vm.addTag(tag),
                            config: m.route
                        }, [
                            m('i.fa.fa-plus'), tag.name
                        ]) :
                        m.component(categoryTag, { tag: tag, addFunc: vm.addTag, context: vm });
            }))
        ]),
        guideList(vm, vm.guides),
        vm.pagination ? pagination(vm.buildUrl() + '&page=%page%', vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
    ]);
};
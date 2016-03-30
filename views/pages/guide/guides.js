var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('../../../models/auth.js');
var layout = require('../../layout/sidebar.js');
var guideList = require('../../components/guide/list.js');
var categoryTag = require('../../../controllers/components/tag/categorytag.js');

module.exports = function(vm) {
    return layout([
        m('.category-header', [
            auth.user() ? m('a.btn.btn-success.new-guide', {
                href: '/guide/new/' + vm.category.id + '-' + slug(vm.category.name),
                config: m.route
            }, [m('i.fa.fa-plus'), ' New Guide']) : [],
            m('h2', vm.category.name),
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
        guideList(vm, vm.guides)
    ]);
};
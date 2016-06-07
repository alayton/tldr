var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var auth = require('models/auth.js');
var modal = require('util/modal.js');
var layout = require('views/layout/sidebar.js');
var pagination = require('views/components/pagination.js');
var header = require('views/components/user/header.js');
var rate = require('controllers/components/comment/rate.js');
var mdtextarea = require('controllers/components/mdtextarea.js');

var md = require('markdown-it')()
    .disable(['image']);

var showReport = function(comment) {
    if (!auth.key()) {
        var login = require('views/modals/login.js');
        modal.show(login);
    } else {
        var report = require('views/modals/reportcomment.js');
        modal.show(report(comment));
    }
};

module.exports = function(vm) {
    var url = '/user/comments/' + vm.user.id + '-' + slug(vm.user.username) + '?page=%page%';

    return layout([
        header(vm.user, 'comments'),
        m('.comments.page-block', vm.comments.length > 0 ? _.map(vm.comments, function(c) {
            var guideUrl = '/guide/' + c.guide_id + '-' + slug(c.guide_title);
            return m('.comment', [
                m('a.guide', { href: guideUrl, config: m.route }, c.guide_title),
                m('.comment', [
                    m('.byline', [
                        m('abbr', { title: moment(c.created).format('lll') }, moment(c.created).fromNow()),
                        c.edited != c.created ? m('span.edited', { title: moment(c.edited).format('lll') }, ' [edited]') : [],
                        m.component(rate, { comment: c, parent: vm }),
                        auth.isPrivileged() || (auth.user() && auth.user().id == c.user_id) ?
                            m('a.edit', {
                                href: 'javascript:;',
                                onclick: vm.edit.bind(vm, c)
                            }, [m('i.fa.fa-pencil'), ' Edit comment']) :
                            m('a.report', {
                                href: 'javascript:;',
                                onclick: _.partial(showReport, c),
                                className: c.reported ? 'done' : ''
                            }, [m('i.fa.fa-flag'), c.reported ? m('.reported', 'Reported!') : ' Report']),
                        auth.isPrivileged() ? m('a.delete', {
                            href: 'javascript:;',
                            onclick: vm.deleteComment.bind(vm, c)
                        }, [m('i.fa.fa-trash-o'), ' Delete']) : []
                    ]),
                    c.editing ? m('.post-comment', [
                        c.bodyError() ? m('.alert.alert-danger', c.bodyError()) : [],
                        m.component(mdtextarea, { val: c.editBody }),
                        m('var', { className: c.editBody().length > vm.MAX_LENGTH ? 'limited' : '' }, [c.editBody().length, ' / ', vm.MAX_LENGTH]),
                        m('.preview.clearfix', m.trust(md.render(c.editBody()))),
                        m('button[type=button].btn.btn-primary.btn-sm', { onclick: vm.save.bind(vm, c) }, 'Save comment'),
                        m('button[type=button].btn.btn-secondary.btn-sm', { onclick: vm.cancelEdit.bind(vm, c) }, 'Cancel')
                    ]) : m('.body', m.trust(md.render(c.body)))
                ])
            ]);
        }) : m('p', 'No comments yet :(')),
        vm.pagination ? pagination(url, vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
    ], 'user-comments');
};
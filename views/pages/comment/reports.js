var _ = require('underscore');
var m = require('mithril');
var slug = require('slug');
var moment = require('moment');
var layout = require('views/layout/sidebar.js');
var pagination = require('views/components/pagination.js');
var mdtextarea = require('controllers/components/mdtextarea.js');

var md = require('markdown-it')()
    .disable(['image']);

module.exports = function(vm) {
    var url = '/comments/reports?page=%page%';

    return layout([
        m('.category-header', m('h2', 'Reported Comments')),
        m('.reports.page-block', vm.reports.length > 0 ? _.map(vm.reports, function(r) {
            var guideUrl = '/guide/' + r.guide_id + '-' + slug(r.guide_title);
            return m('.report', [
                m('a.guide', { href: guideUrl, config: m.route }, r.guide_title),
                m('.comment', [
                    m('.byline', [
                        'Posted by ',
                        m('a.user', { href: '/user/guides/' + r.author_id + '-' + slug(r.author_name) }, r.author_name),
                        m('.reported', ['Reported ', r.num_reports, ' time', r.num_reports > 1 ? 's' : '']),
                        m('a.edit', {
                            href: 'javascript:;',
                            onclick: vm.edit.bind(vm, r)
                        }, [m('i.fa.fa-pencil'), ' Edit comment']),
                        m('a.delete', {
                            href: 'javascript:;',
                            onclick: vm.deleteComment.bind(vm, r)
                        }, [m('i.fa.fa-trash-o'), ' Delete comment']),
                        m('a.resolve', {
                            href: 'javascript:;',
                            onclick: vm.resolve.bind(vm, r)
                        }, [m('i.fa.fa-ban'), ' Resolve report'])
                    ]),
                    r.editing ? m('.post-comment', [
                        r.bodyError() ? m('.alert.alert-danger', r.bodyError()) : [],
                        m.component(mdtextarea, { val: r.editBody }),
                        m('var', { className: r.editBody().length > vm.MAX_LENGTH ? 'limited' : '' }, [r.editBody().length, ' / ', vm.MAX_LENGTH]),
                        m('.preview.clearfix', m.trust(md.render(r.editBody()))),
                        m('button[type=button].btn.btn-primary.btn-sm', { onclick: vm.save.bind(vm, r) }, 'Save comment'),
                        m('button[type=button].btn.btn-secondary.btn-sm', { onclick: vm.cancelEdit.bind(vm, r) }, 'Cancel')
                    ]) : m('.body', m.trust(md.render(r.comment_body)))
                ]),
                m('.reason', [
                    m('strong', 'Reason: '),
                    r.reason
                ])
            ]);
        }) : 'Nothing to see here..'),
        vm.pagination ? pagination(url, vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
    ], 'comment-reports');
};
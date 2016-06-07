var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var modal = require('util/modal.js');
var guideurl = require('util/guideurl.js');
var imageurl = require('util/imageurl.js');
var auth = require('models/auth.js');
var rate = require('controllers/components/comment/rate.js');
var mdtextarea = require('controllers/components/mdtextarea.js');
var pagination = require('views/components/pagination.js');

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
    var urlPattern = vm.baseUrl + '?comment-page=%page%';
    if (vm.sort != 'rating') urlPattern += '&comment-sort=' + vm.sort();

    return m('.comments.page-block', [
        m('h3', 'Comments'),
        m('.post-comment', [
            vm.bodyError() ? m('.alert.alert-danger', vm.bodyError()) : [],
            m.component(mdtextarea, { val: vm.body }),
            m('var', { className: vm.body().length > vm.MAX_LENGTH ? 'limited' : '' }, [vm.body().length, ' / ', vm.MAX_LENGTH]),
            m('.preview.clearfix', m.trust(md.render(vm.body()))),
            m('button[type=button].btn.btn-primary.btn-sm', { onclick: vm.post.bind(vm), disabled: vm.saving() }, auth.key() ? 'Post comment' : 'Log in to comment')
        ]),
        vm.comments.length > 0 ? [
            pagination(urlPattern, vm.page(), vm.totalResults(), vm.perPage()),
            m('.sort', [
                'Sort by ',
                m('select.sort', { onchange: m.withAttr('value', vm.sort), value: vm.sort() }, [
                    m('option', { value: 'rating' }, 'Rating'),
                    m('option', { value: 'date' }, 'Date')
                ])
            ]),
            _.map(vm.comments, function(c) {
                return m('.comment', [
                    m('.byline', [
                        'Posted by ',
                        m('a.user', { href: '/user/guides/' + c.user_id + '-' + slug(c.user_name) }, c.user_name),
                        ' ',
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
                        m('button[type=button].btn.btn-primary.btn-sm', { onclick: vm.save.bind(vm, c), disabled: vm.saving() }, 'Save comment'),
                        m('button[type=button].btn.btn-secondary.btn-sm', { onclick: vm.cancelEdit.bind(vm, c) }, 'Cancel')
                    ]) : m('.body', m.trust(md.render(c.body)))
                ]);
            }),
            pagination(urlPattern, vm.page(), vm.totalResults(), vm.perPage()),
            m('.clearfix')
        ] : m('.comment-ph', 'No comments yet!')
    ]);
};
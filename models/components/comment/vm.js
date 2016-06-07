var m = require('mithril');
var _ = require('underscore');
var layout = require('views/layout/skeleton.js');
var auth = require('models/auth.js');
var req = require('util/request.js');
var prop = require('util/prop.js');
var param = require('util/param.js');
var modal = require('util/modal.js');
var title = require('util/page/title.js');

var vm = function(type, params, arg) {
    if (type == 'guide') {
        this.comments = [];
        this.guideId = arg.guideId;
        this.baseUrl = arg.baseUrl;
        this.load = this.loadGuides.bind(this);
    } else if (type == 'reports') {
        if (!arg && !auth.isPrivileged()) {
            m.route('/404');
            return;
        }

        this.reports = [];
        this.load = this.loadReports.bind(this, arg);
        title(this, 'Reported Comments');
    } else if (type == 'user') {
        this.comments = [];
        this.user = { id: 0, username: '???' };

        var userId = parseInt(param(params, 'id', 0));
        this.load = this.loadUser.bind(this, userId, arg);
    }

    this.type = type;
    this.MAX_LENGTH = 200;
    this.ratings = {};
    this.body = m.prop('');
    this.bodyError = m.prop(null);
    this.saving = m.prop(false);

    var page = param(params, 'comment-page', 1),
        sort = param(params, 'comment-sort', 'rating');

    this.page = m.prop(page);
    this.sort = prop(sort, function(sort) {
        this.load();
    }.bind(this));
    this.totalResults = m.prop(0);
    this.perPage = m.prop(20);

    this.load();
};

vm.prototype = {
    loadGuides: function() {
        var page = this.page(),
            sort = this.sort(),
            options = [];

        if (page > 1) options.push('page=' + page);
        if (sort != 'rating') options.push('sort=' + sort);

        req({
            endpoint: '/comments/guide/' + this.guideId + (options.length > 0 ? '?' + options.join('&') : '')
        }, this).then(function(data) {
            this.comments = data.comments;
            this.totalResults(data.total_results);
            this.perPage(data.results_per_page);

            if (auth.key()) {
                var ids = _.pluck(this.comments, 'id');
                if (ids && ids.length > 0) {
                    req({
                        endpoint: '/comments/ratings/' + ids.join(',')
                    }).then(function(data) {
                        this.ratings = data.ratings;
                    }.bind(this));
                }
            }
        }.bind(this));
    },
    loadReports: function(done) {
        req({
            endpoint: '/comments/reports?page=' + this.page()
        }).then(function(data) {
            this.reports = data.reports;
            this.pagination = {
                page: data.page,
                total_results: data.total_results,
                results_per_page: data.results_per_page
            };

            if (done) done(null, this);
        }.bind(this));
    },
    loadUser: function(userId, done) {
        if (!userId && done) {
            done(null, this);
        } else {
            var promises = [];

            promises.push(req({
                endpoint: '/comments/user/' + userId + '?page=' + this.page()
            }).then(function(data) {
                this.comments = data.comments;
                this.pagination = {
                    page: data.page,
                    total_results: data.total_results,
                    results_per_page: data.results_per_page
                };

                if (auth.key()) {
                    var ids = _.pluck(this.comments, 'id');
                    if (ids && ids.length > 0) {
                        req({
                            endpoint: '/comments/ratings/' + ids.join(',')
                        }).then(function(data) {
                            this.ratings = data.ratings;
                        }.bind(this));
                    }
                }
            }.bind(this)));

            if (userId > 0) {
                promises.push(req({
                    endpoint: '/user/' + userId
                }).then(function(data) {
                    this.user = data.user;

                    title(this, this.user.username + "'s Comments");
                }.bind(this)));
            } else {
                this.user = auth.user();

                title(this, this.user.username + "'s Comments");
            }

            m.sync(promises).then(function() {
                if (done) done(null, this);
            }.bind(this));
        }
    },
    resolve: function(report) {
        req({
            method: 'DELETE',
            endpoint: '/comments/report/' + report.comment_id
        }).then(function(data) {
            this.load();
        }.bind(this));
    },
    edit: function(comment) {
        comment.editing = true;
        comment.editBody = m.prop(this.type == 'reports' ? comment.comment_body : comment.body);
        comment.bodyError = m.prop(null);
    },
    cancelEdit: function(comment) {
        comment.editing = false;
    },
    save: function(comment) {
        if (!comment.editBody) {
            comment.editing = false;
            return;
        } else if (this.saving()) {
            return;
        }

        this.saving(true);
        req({
            method: 'PUT',
            endpoint: '/comment/' + (this.type == 'reports' ? comment.comment_id : comment.id),
            data: { body: comment.editBody() }
        }).then(function(data) {
            this.saving(false);
            comment.editing = false;
            if (this.type == 'reports') {
                comment.comment_body = data.comment.body;
            } else {
                comment.body = data.comment.body;
            }
        }.bind(this), function(data) {
            this.saving(false);

            if (data.field_errors && data.field_errors.Body) {
                comment.bodyError(data.field_errors.Body);
            } else if (data.error) {
                comment.bodyError(data.error);
            } else {
                comment.bodyError('An error occurred');
            }
        }.bind(this));
    },
    deleteComment: function(comment) {
        if (!auth.isPrivileged()) return;
        if (!window.confirm('Delete this comment?')) return;

        if (this.type == 'reports') {
            req({
                method: 'DELETE',
                endpoint: '/comment/' + report.comment_id
            }).then(function(data) {
                if (data.ok) {
                    this.resolve(report);
                }
            }.bind(this));
        } else {
            req({
                method: 'DELETE',
                endpoint: '/comment/' + comment.id
            }).then(function(data) {
                this.load();
            }.bind(this));
        }
    },
    post: function() {
        if (!auth.key()) {
            var login = require('views/modals/login.js');
            modal.show(login);
            return;
        }

        var body = this.body();

        if (body) {
            this.saving(true);

            req({
                method: 'POST',
                endpoint: '/comment',
                data: { guide_id: this.guideId, body: body }
            }).then(function(data) {
                this.saving(false);
                this.bodyError(null);
                this.body('');

                if (data.ok) this.load();
            }.bind(this), function(data) {
                this.saving(false);

                if (data.field_errors && data.field_errors.Body) {
                    this.bodyError(data.field_errors.Body);
                } else if (data.error) {
                    this.bodyError(data.error);
                } else {
                    this.bodyError('An error occurred');
                }
            }.bind(this));
        }
    }
};

module.exports = vm;
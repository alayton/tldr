var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var social = require('util/socialaccounts.js');

module.exports = function(user, opts) {
    opts = opts || {};
    opts.full = opts.full || false;
    opts.prefix = opts.prefix || '';

    var userClass = '',
        classLabel = '';
    if ((user.roles & 2) > 0) {
        userClass = 'exec';
        classLabel = 'TLDR.gg Executive';
    } else if ((user.roles & 4) > 0) {
        userClass = 'admin';
        classLabel = 'Administrator';
    } else if ((user.roles & 8) > 0) {
        userClass = 'mod';
        classLabel = 'Moderator';
    }

    if (opts.full) {
        return m('.user-lg', [
            m('a.profile', {
                className: userClass,
                config: m.route,
                href: '/user/guides/' + user.id + '-' + slug(user.username)
            }, [opts.prefix, m('i.fa.fa-user', { title: classLabel }), ' ', user.username]),
            _.map(user.social_accounts, function(acct) {
                var info = social[acct.type];
                if (!info) return '';

                return m('a.social.fa', {
                    target: '_blank',
                    rel: 'nofollow',
                    href: info.url.replace(':id', acct.id),
                    title: info.name,
                    className: info.icon,
                    style: { color: info.color }
                });
            })
        ]);
    } else {
        var info = user.social_id && social[user.social_type];

        return m('.user-sm', [
            m('a.profile', {
                className: userClass,
                config: m.route,
                href: '/user/guides/' + user.id + '-' + slug(user.username)
            }, [opts.prefix, m('i.fa.fa-user', { title: classLabel }), ' ', user.username]),
            info ? m('a.social.fa', {
                target: '_blank',
                rel: 'nofollow',
                href: info.url.replace(':id', user.social_id),
                title: info.name,
                className: info.icon,
                style: { color: info.color }
            }) : []
        ]);
    }
};
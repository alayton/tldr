var m = require('mithril');
var _ = require('underscore');
var slug = require('slug');
var moment = require('moment');
var config = require('config.js');
var auth = require('models/auth.js');
var layout = require('views/layout/sidebar.js');
var pagination = require('views/components/pagination.js');
var header = require('views/components/user/header.js');

module.exports = function(vm) {
    var url = '/user/images/' + vm.user.id + '-' + slug(vm.user.username) + '?page=%page%';

    return layout([
        header(vm.user, 'images'),
        vm.images.length ?
            [
                m('.card-deck', _.map(vm.images, function(img) {
                    return m('a.card', {
                        href: config.apiRoot + '/image/' + img.id,
                        target: '_blank',
                        style: { width: '200px', flex: 'none' }
                    }, [
                        m('img.card-img-top', { src: config.apiRoot + '/image/' + img.id + '/200/0', width: 200, height: (200 * (img.height / img.width)) }),
                        /*m('.card-block', [
                            m('p.card-text', img.name)
                        ])*/
                    ]);
                })),
                vm.pagination ? pagination(url, vm.pagination.page, vm.pagination.total_results, vm.pagination.results_per_page) : []
            ] :
            m('.images', m('p', 'No images yet :('))
    ], 'user-images');
};
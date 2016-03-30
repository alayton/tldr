var base = require('../base.js');
var view = require('../../views/pages/search/search.js');
var vm = require('../../models/pages/search/search.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
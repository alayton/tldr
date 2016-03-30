var base = require('./base.js');
var view = require('../views/pages/tag/tags.js');
var vm = require('../models/pages/tag/tags.js');

var controller = base(function(params, done) {
    if (!params) params = {};
    params.id = 1;

    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
var base = require('./base.js');
var view = require('../views/pages/404.js');
var vm = require('../models/pages/404.js');

var controller = base(function(params, done) {
    return new vm(done);
});

module.exports = {
    controller: controller,
    view: view
};
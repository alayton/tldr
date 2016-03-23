var base = require('./base.js');
var view = require('../views/pages/about.js');
var vm = require('../models/pages/about.js');

var controller = base(function(params, done) {
    return new vm(done);
});

module.exports = {
    controller: controller,
    view: view
};
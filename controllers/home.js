var base = require('./base.js');
var view = require('../views/pages/home.js');
var vm = require('../models/pages/home.js');

var controller = base(function(params, done) {
    return new vm(done);
});

module.exports = {
    controller: controller,
    view: view
};
var base = require('../base.js');
var view = require('../../views/pages/user/activate.js');
var vm = require('../../models/pages/user/activate.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
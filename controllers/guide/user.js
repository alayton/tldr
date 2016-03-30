var base = require('../base.js');
var view = require('../../views/pages/guide/user.js');
var vm = require('../../models/pages/guide/user.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
var base = require('controllers/base.js');
var view = require('views/pages/user/images.js');
var vm = require('models/pages/user/images.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
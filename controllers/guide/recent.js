var base = require('controllers/base.js');
var view = require('views/pages/guide/recent.js');
var vm = require('models/pages/guide/recent.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
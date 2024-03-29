var base = require('controllers/base.js');
var view = require('views/pages/guide/guides.js');
var vm = require('models/pages/guide/guides.js');

var controller = base(function(params, done) {
    return new vm(params, done);
});

module.exports = {
    controller: controller,
    view: view
};
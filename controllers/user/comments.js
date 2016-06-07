var base = require('controllers/base.js');
var view = require('views/pages/user/comments.js');
var vm = require('models/components/comment/vm.js');

var controller = base(function(params, done) {
    return new vm('user', params, done);
});

module.exports = {
    controller: controller,
    view: view
};
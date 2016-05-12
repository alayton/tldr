var view = require('views/components/user/rename.js');
var vm = require('models/components/user/rename.js');

var controller = function() {
    return new vm();
};

module.exports = {
    controller: controller,
    view: view
};
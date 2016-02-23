var view = require('../../../views/components/user/login.js');
var vm = require('../../../models/components/user/login.js');

var controller = function() {
    return new vm();
};

module.exports = {
    controller: controller,
    view: view
};
var view = require('../../../views/components/user/signup.js');
var vm = require('../../../models/components/user/signup.js');

var controller = function() {
    return new vm();
};

module.exports = {
    controller: controller,
    view: view
};
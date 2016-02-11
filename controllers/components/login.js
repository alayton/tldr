var view = require('../../views/components/login.js');
var vm = require('../../models/components/login.js');

var controller = function() {
    return new vm();
};

module.exports = {
    controller: controller,
    view: view
};
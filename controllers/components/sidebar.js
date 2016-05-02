var view = require('views/components/sidebar.js');
var vm = require('models/components/sidebar.js');

var controller = function(args) {
    return new vm();
};

module.exports = {
    controller: controller,
    view: view
};
var view = require('../../views/components/images.js');
var vm = require('../../models/components/images.js');

var controller = function(args) {
    return new vm(args.select, args.category);
};

module.exports = {
    controller: controller,
    view: view
};
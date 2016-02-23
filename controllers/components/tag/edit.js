var view = require('../../../views/components/tag/edit.js');
var vm = require('../../../models/components/tag/edit.js');

var controller = function(args) {
    return new vm(args ? args.id : 0);
};

module.exports = {
    controller: controller,
    view: view
};
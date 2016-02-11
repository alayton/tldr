var view = require('../../views/components/mdtextarea.js');
var vm = require('../../models/components/mdtextarea.js');

var controller = function(args) {
    return new vm(args.val);
};

module.exports = {
    controller: controller,
    view: view
};
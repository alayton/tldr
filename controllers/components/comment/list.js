var view = require('views/components/comment/list.js');
var vm = require('models/components/comment/vm.js');

var controller = function(args) {
    return new vm('guide', args.params, args);
};

module.exports = {
    controller: controller,
    view: view
};
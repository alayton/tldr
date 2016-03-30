var view = require('../../../views/components/guide/rate.js');
var vm = require('../../../models/components/guide/rate.js');

var controller = function(args) {
    return new vm(args.guide, args.parent);
};

module.exports = {
    controller: controller,
    view: view
};
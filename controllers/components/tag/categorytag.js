var view = require('../../../views/components/tag/categorytag.js');
var vm = require('../../../models/components/tag/categorytag.js');

var controller = function(args) {
    return new vm(args.tag, args.addFunc, args.context, args.onclick || false);
};

module.exports = {
    controller: controller,
    view: view
};
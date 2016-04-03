var view = require('views/components/crop.js');
var vm = require('models/components/crop.js');

var controller = function(args) {
    return new vm(args.src, args.buffer, args.preview);
};

module.exports = {
    controller: controller,
    view: view
};
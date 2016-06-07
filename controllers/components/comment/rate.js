var view = require('views/components/comment/rate.js');
var vm = require('models/components/comment/rate.js');

var controller = function(args) {
    return new vm(args.comment, args.parent);
};

module.exports = {
    controller: controller,
    view: view
};
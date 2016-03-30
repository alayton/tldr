var req = require('../../../util/request.js');

var vm = function(guide, parent) {
    this.guide = guide;
    this.parent = parent;
};

vm.prototype = {
    rate: function(rating) {
        var self = this;

        req({
            endpoint: '/rateguide/' + self.guide.id,
            method: 'POST',
            data: { rating: rating }
        }).then(function(data) {
            self.guide.rating = data.guide.rating;
            self.parent.ratings[data.guide.id] = rating;
        });
    }
};

module.exports = vm;
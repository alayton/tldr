var req = require('util/request.js');

var vm = function(comment, parent) {
    this.comment = comment;
    this.parent = parent;
};

vm.prototype = {
    rate: function(rating) {
        var self = this;

        req({
            endpoint: '/comments/rate/' + self.comment.id,
            method: 'POST',
            data: { rating: rating }
        }).then(function(data) {
            self.comment.rating = data.comment.rating;
            self.parent.ratings[data.comment.id] = rating;
        });
    }
};

module.exports = vm;
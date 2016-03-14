var _ = require('underscore');

var mapping = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
];

module.exports = function(number) {
    var result = [];
    _.each(mapping, function(k) {
        var div = Math.floor(number / k[0]);
        var mod = number % k[0];
        _.times(div, function() {
            result.push(k[1]);
        });
        number = mod;
    });
    return result.join('');
};
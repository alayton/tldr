var config = require('../config.js');

module.exports = function(id, width, height, enlarge) {
    width = width || 0;
    height = height || 0;
    enlarge = enlarge || 0;

    return config.apiRoot + '/image/' + id + '/' + width + '/' + height + '/' + enlarge;
};
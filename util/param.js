var m = require('mithril');

module.exports = function(params, key, def) {
    if (params && params[key]) {
        return params[key];
    } else if (typeof window !== 'undefined') {
        return m.route.param(key) || def;
    } else {
        return def;
    }
};
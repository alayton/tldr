module.exports = function(store, callback) {
    return function(value) {
        if (arguments.length > 0) {
            store = value;
            callback(value);
        }
        return store;
    };
};
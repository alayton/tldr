var supports = {
    localStorage: null
};

module.exports = {
    localStorage: function() {
        if (supports.localStorage === null) {
            try {
                localStorage.setItem('supportTest', 'supportTest');
                localStorage.removeItem('supportTest');
                supports.localStorage = true;
            } catch (e) {
                supports.localStorage = false;
            }
        }
        return supports.localStorage;
    }
};
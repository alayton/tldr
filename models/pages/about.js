var vm = function(done) {
    this.title = 'About';

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
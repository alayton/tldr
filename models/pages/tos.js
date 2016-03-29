var vm = function(done) {
    this.title = 'Terms of Service';

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
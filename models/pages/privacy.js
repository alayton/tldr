var vm = function(done) {
    this.title = 'Privacy';

    if (done) {
        done(null, this);
    }
};

module.exports = vm;
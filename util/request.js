var request = require('request');
var m = require('mithril');
var _ = require('underscore');

var reqCallback = function(deferred, url, error, response, body) {
    if (error) {
        try {
            var errorData = JSON.parse(body);
            deferred.reject(errorData);
        } catch (e) {
            deferred.reject(error);
        }
    } else {
        var data = JSON.parse(body);
        req.cache[url.replace('http:', '')] = data;
        deferred.resolve(data);
    }
};

var req = function(options) {
    var deferred = m.deferred();
    var opts = {};

    opts.method = options.method || 'GET';

    if (options.endpoint) {
        opts.uri = 'http://tldrapi.alayton.com' + options.endpoint;
    } else if (options.url) {
        opts.uri = options.url;
    }

    if (options.data) {
        opts.body = options.data;
        opts.json = true;
    }

    request(opts, _.partial(reqCallback, deferred, opts.uri));
    return deferred.promise;
};

req.cache = {};

module.exports = req;
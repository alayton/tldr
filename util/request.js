var request = require('request');
var m = require('mithril');
var _ = require('underscore');
var config = require('../config.js');

var reqCallback = function(deferred, url, vm, error, response, body) {
    if (error) {
        try {
            var errorData = JSON.parse(body);
            deferred.reject(errorData);
        } catch (e) {
            deferred.reject(error);
        }
    } else {
        var data = JSON.parse(body);
        if (vm && vm._reqs) {
            vm._reqs[url] = data;
        }
        deferred.resolve(data);
    }
};

var req = function(options, vm) {
    var deferred = m.deferred();
    var opts = {};

    opts.method = options.method || 'GET';

    if (options.endpoint) {
        opts.uri = config.apiRoot + options.endpoint;
    } else if (options.url) {
        opts.uri = options.url;
    }

    if (options.data) {
        opts.body = options.data;
        opts.json = true;
    }

    request(opts, _.partial(reqCallback, deferred, opts.uri, vm));
    return deferred.promise;
};

module.exports = req;
var m = require('mithril');
var _ = require('underscore');
var config = require('../config.js');
var auth = require('../models/auth.js');

var addAuthHeader = function(xhr) {
    xhr.setRequestHeader('Authorization', auth.key());
};

var req = function(options, skipAuth) {
    if (options.endpoint) {
        options.url = config.apiRoot + options.endpoint;
    }

    if (window['tldrRequests'] !== undefined && tldrRequests && tldrRequests[options.url]) {
        var deferred = m.deferred();
        m.startComputation();
        _.defer(function(deferred, data) {
            deferred.resolve(data);
            m.endComputation();
        }, deferred, tldrRequests[options.url]);
        return deferred.promise;
    }

    if (!skipAuth && auth.key()) {
        options.config = addAuthHeader;
    }

    options.unwrapSuccess = options.unwrapError = function(data, xhr) {
        data = data || {};
        data.statusCode = xhr.status;
        return data;
    };

    var req = m.request(options);
    req.then(null, function(data) {
        if (data.statusCode == 401) {
            auth.logout(true);
        }
    });
    return req;

};

module.exports = req;
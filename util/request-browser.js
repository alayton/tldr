var m = require('mithril');
var _ = require('underscore');
var auth = require('../models/auth.js');

var addAuthHeader = function(xhr) {
    xhr.setRequestHeader('Authorization', auth.key());
};

var req = function(options, skipAuth) {
    if (options.endpoint) {
        options.url = '//tldrapi.alayton.com' + options.endpoint;
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

    return m.request(options);
};

module.exports = req;
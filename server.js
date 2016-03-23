var express = require('express');
var render = require('mithril-node-render');
var _ = require('underscore');
var req = require('./util/request.js');
var routes = require('./routes.js');
var title = require('./util/title.js');

var app = express();

var base = function(content) {
    return [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '<title>',
        title.current,
        '</title>',
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',
        '<link href="/asset/img/favicon.ico" rel="shortcut icon">',
        '<!-- inject:css --><link rel="stylesheet" href="/asset/built/css/bootstrap-flex_39b8cb883b728793bac8f263309f618e.css"><link rel="stylesheet" href="/asset/built/css/font-awesome.min_a926580456892ca47e8fe14e69af5d08.css"><link rel="stylesheet" href="/asset/built/css/style_2bb0630613a743d41ca5f8a9b7abcb37.css"><!-- endinject -->',
        '</head>',
        '<body>',
        content,
        (req.cache ? ('<script type="text/javascript">var tldrRequests = ' + JSON.stringify(req.cache) + ';</script>') : ''),
        '<!-- inject:js --><script src="/asset/built/js/app_31b37ebf4f5a1b315723eb370c0e1a67.js"></script><!-- endinject -->',
        '</body>',
        '</html>'
    ].join('');
};

var dispatch = function(req, res, next, module, route) {
    function send(scope) {
        res.end(base(render(module.view(scope))));
        scope && scope.onunload && scope.onunload();
    }

    var params = _.extend({}, req.params, req.query);
    if (module.controller.length < 2) { //sync, response immediately
        return send(module.controller(params));
    } else { // async, call with callback
        return module.controller(params, function(err, scope) {
            if (err) {
                return next(err);
            }
            send(scope);
        });
    }
};

_.each(routes, function(module, route) {
    app.get(route, function(req, res, next) {
        res.type('html');
        return dispatch(req, res, next, module, route);
    });
});

app.use(function(req, res, next) {
    res.type('html').status(404);
    dispatch(req, res, next, routes['/404'], '/404');
});

var port = process.env.PORT || 8000;
console.log('Server is now running on port ' + port);
app.listen(port, '127.0.0.1');
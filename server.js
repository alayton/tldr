var express = require('express');
var render = require('mithril-node-render');
var _ = require('underscore');
var routes = require('./routes.js');
var inject = require('./inject.js');

var app = express();

var base = function(content, scope) {
    return [
        '<!doctype html>',
        '<html lang="en">',
        '<head>',
        '<title>',
        (scope.title ? scope.title + ' - ' : '') + 'TLDR.gg',
        '</title>',
        '<meta charset="utf-8">',
        '<meta name="description" content="Short guides."/>',
        '<meta name="keywords" content="tldr guides short quick howto games "/>',
        '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">',
        '<meta name="google-signin-client_id" content="163518250187-51bprkdp97tmfmsct3v48c6och97f5ut.apps.googleusercontent.com">',
        '<link href="/asset/img/favicon.ico" rel="shortcut icon">',
        '<link href="https://fonts.googleapis.com/css?family=Droid+Sans" rel="stylesheet" type="text/css">',
        (scope.canonical ? '<link id="canon" href="' + scope.canonical + '" rel="canonical">' : ''),
        (scope.ogImage ? '<meta property="og:image" content="' + scope.ogImage + '" />' : ''),
        inject.css,
        '</head>',
        '<body>',
        content,
        (scope._reqs ? ('<script type="text/javascript">var tldrRequests = ' + JSON.stringify(scope._reqs) + ';</script>') : ''),
        inject.js,
        '<script>var isGooglePlatformLoaded = false; function onGooglePlatform() { isGooglePlatformLoaded = true; }</script>',
        '<script src="https://apis.google.com/js/platform.js?onload=onGooglePlatform" async defer></script>',
        "<script>var isFacebookSDKLoaded = false; window.fbAsyncInit = function() { FB.init({ appId: '542585189279192', xfbml: false, version: 'v2.6' }); isFacebookSDKLoaded = true; };(function(d, s, id){var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) {return;}js = d.createElement(s); js.id = id;js.src = '//connect.facebook.net/en_US/sdk.js';fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));</script>",
        "<script>window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;ga('create', 'UA-75462303-1', 'auto');ga('require', 'autotrack');ga('send', 'pageview');</script>",
        '<script async src="https://www.google-analytics.com/analytics.js"></script>',
        '</body>',
        '</html>'
    ].join('');
};

var dispatch = function(req, res, next, module, route) {
    function send(scope) {
        res.end(base(render(module.view(scope)), scope));
        scope && scope.onunload && scope.onunload();
    }

    var params = _.extend({}, req.params, req.query), scope;
    if (module.controller.length < 2) { //sync, response immediately
        scope = module.controller(params);
        return send(scope);
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
var m = require('mithril');
var _ = require('underscore');
var modal = require('util/modal.js');
var req = require('util/request.js');
var auth = require('models/auth.js');
var layout = require('views/layout/skeleton.js');

var googleSuccess = function(user) {
    if (auth.key()) return;

    var token = user.getAuthResponse().id_token;
    req({
        endpoint: '/google/auth',
        method: 'POST',
        data: { token: token }
    }, true).then(function(data) {
        if (data.ok && data.token) {
            auth.key(data.token);
            auth.user(data.user);

            modal.hide();
        } else if (data.error) {
            layout.errors().push(data.error);
        } else {
            layout.errors().push('An error occurred.');
        }
    });
};

var googleError = function(error) {
    console.log(error);
};

var setupGoogleSignin = function(el, isInitialized) {
    if (isInitialized || !window) return;

    if (window.isGooglePlatformLoaded) {
        gapi.signin2.render('google-signin', {
            scope: 'profile email',
            width: 240,
            height: 50,
            longtitle: true,
            theme: 'dark',
            onsuccess: googleSuccess,
            onfailure: googleError
        });
    } else {
        setTimeout(_.partial(setupGoogleSignin, el, isInitialized), 100);
    }
};

var doFacebookSignin = function(e) {
    e.preventDefault();
    FB.login(function(resp) {
        if (resp.status == 'connected') {
            var token = resp.authResponse.accessToken;
            req({
                endpoint: '/facebook/auth',
                method: 'POST',
                data: { token: token }
            }, true).then(function(data) {
                if (data.ok && data.token) {
                    auth.key(data.token);
                    auth.user(data.user);

                    modal.hide();
                } else if (data.error) {
                    layout.errors().push(data.error);
                } else {
                    layout.errors().push('An error occurred.');
                }
            });
        } else if (resp.status == 'not_authorized') {
            layout.errors().push('To sign in with Facebook, you must authorize the TLDR.gg app');
        } else {
            layout.errors().push('Please log into Facebook');
        }
    }, { scope: 'public_profile,email' });
};

module.exports = [
    m('#google-signin', { config: setupGoogleSignin }),
    m('button[type=button]#facebook-signin', { onclick: doFacebookSignin }, [
        m('i.fa.fa-facebook-official'),
        'Sign in with Facebook'
    ])
];
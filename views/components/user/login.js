var m = require('mithril');
var _ = require('underscore');
var $ = require('jquery');
var req = require('util/request.js');
var auth = require('models/auth.js');
var layout = require('views/layout/skeleton.js');

var showSignup = function() {
    $('#loginModal').modal('hide');
    $('#signupModal').modal('show');
};

var googleSuccess = function(vm, user) {
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

            vm.closeModal();
        } else if (data.error) {
            layout.errors().push(data.error);
        } else {
            layout.errors().push('An error occurred.');
        }
    });
};

var googleError = function(vm, error) {
    console.log(error);
};

var setupGoogleSignin = function(vm, el, isInitialized) {
    if (isInitialized || !window) return;

    if (window.isGooglePlatformLoaded) {
        gapi.signin2.render('google-signin', {
            scope: 'profile email',
            width: 240,
            height: 50,
            longtitle: true,
            theme: 'dark',
            onsuccess: _.partial(googleSuccess, vm),
            onfailure: _.partial(googleError, vm)
        });
    } else {
        setTimeout(_.partial(setupGoogleSignin, vm, el, isInitialized), 100);
    }
};

var doFacebookSignin = function(vm, e) {
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

                    vm.closeModal();
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

module.exports = function(vm) {
    return m('#loginModal.modal.fade', m('.modal-dialog', m('form.modal-content', { onsubmit: _.bind(vm.submit, vm) }, [
        m('.modal-header', [
            m('button.close[type=button]', { onclick: vm.closeModal }, m('span', m.trust('&times;'))),
            m('h4.modal-title', 'Log in to TLDR.gg')
        ]),
        m('.modal-body', [
            vm.error() ? m('.alert.alert-danger', vm.error()) : [],
            m('fieldset.form-group', { className: vm.emailError() ? 'has-danger' : '' }, [
                m('label[for=email]', 'Email'),
                m('input.form-control', { type: 'email', onchange: m.withAttr('value', vm.email), value: vm.email() }),
                vm.emailError() ? m('small', vm.emailError()) : null
            ]),
            m('fieldset.form-group', { className: vm.passwordError() ? 'has-danger' : '' }, [
                m('label[for=password]', 'Password'),
                m('input.form-control', { type: 'password', onchange: m.withAttr('value', vm.password), value: vm.password() }),
                vm.passwordError() ? m('small', vm.passwordError()) : null
            ])
        ]),
        m('.modal-footer', [
            m('#google-signin', { config: _.partial(setupGoogleSignin, vm) }),
            m('button[type=button]#facebook-signin', { onclick: _.partial(doFacebookSignin, vm) }, [
                m('i.fa.fa-facebook-official'),
                'Sign in with Facebook'
            ])
        ]),
        m('.modal-footer', [
            m('.pull-left', [
                'Don\'t have an account? ',
                m('a[href=javascript:;]', { onclick: showSignup }, 'Sign up')
            ]),
            m('button.btn.btn-secondary[type=button]', { onclick: vm.closeModal }, 'Close'),
            m('button.btn.btn-primary[type=submit]', 'Log in')
        ])
    ])))
};
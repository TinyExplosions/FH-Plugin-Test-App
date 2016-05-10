define([
    'jquery',
    'underscore',
    'backbone',
    'views/base/BaseView',
    'views/base/BlankView',
    'views/login/LoginView',
    'views/about/AboutView',
], function($, _, Backbone, BaseView, BlankView, LoginView, AboutView) {

    var Router = Backbone.Router.extend({

        routes: {
            'login': 'loginView',
            'logout': 'logout',
            'about': 'aboutView',
            '*default': 'defaultView'
        },

        initialize: function() {
            console.log("Call Baseview");
            App.BaseView = new BaseView();
        },

        before: function(params, next) {
            next();
            // var path = Backbone.history.location.hash;
            // App.BaseView.Header.model.set('open', false);
            // // return next();
            // var user = Session.get('user');
            // var authenticated = Session.get('authenticated');
            // console.log("authenticated!", authenticated);
            // App.Connection.goOnline();
            // if (path !== "#refresh") {
            //     Session.set('previousPath', path);
            // }
            // if (path === "#logout") {
            //     return next();
            // }
            // if (authenticated === "true") {
            //     if (!Session.get('profileSaved') && path !== '#profile') {
            //         return Backbone.history.navigate('profile', {
            //             trigger: true
            //         });
            //     }
            //     return next();
            // } else if (path === '#login') {
            //     return next();
            // } else {
            //     console.log("not auth?");
            //     if (path == "login") {
            //         path = "";
            //     }
            //     Session.set('redirectFrom', path);
            //     return Backbone.history.navigate('login', {
            //         trigger: true
            //     });
            // }
        },

        after: function() {
            // this is run after each route
        },
        aboutView: function() {
            App.Page.showView(new AboutView());
        },
        defaultView: function() {
            App.Page.showView(new BlankView());
            // var homepage = Session.get('homepage') || "";
            // this.documentCollectionView(homepage);
        },
        loginView: function() {
            new LoginView();
        },
        logout: function() {
            App.vent.trigger('user:logout');
            Backbone.history.navigate('', {
                trigger: true
            });
        }

    });

    return Router;
});

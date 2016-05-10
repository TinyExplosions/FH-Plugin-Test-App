// Filename: app.js
define([
    'jquery',
    'underscore',
    'backbone',
    'helpers/router',
    'helpers/extendRouter',
    'helpers/pageHelper',
    'helpers/connectionHelper',
    'stethoscope',
    'connectivityFSM',
], function($, _, Backbone, Router, ExtendRouter, PageHelper, ConnectionHelper, Stethoscope, ConnectivityFSM) {
    stethoscope = new Stethoscope();

    var initialize = function() {

        this.vent = new _.extend({}, Backbone.Events);
        this.Page = new PageHelper.pageTransition();

        this.VersionInfo = {
            Client: 'x.y.z',
            Cloud: 'development',
            AppName: 'Template App'
        }

        if (typeof(AppVersion) !== "undefined") {
            this.VersionInfo.Client = AppVersion.version;
        }

        this.Connection = new ConnectivityFSM({
            stethoscope: stethoscope
        });
        ConnectionHelper.initialize();


        if (navigator.splashscreen) {
            setTimeout(function() {
                navigator.splashscreen.hide();
            }, 2000);
        }

        this.Router = new Router();
        onStartup.then(function() {
            console.log("START THE KRAKEN!");
            Backbone.history.start();
            return this;
        });
    };

    var onStartup = new Promise(function(resolve, reject) {
        // Do anything async in here like
        setTimeout(function() {
            resolve("onStartupComplete.");
        }, 500);
    });

    return {
        initialize: initialize,
    };

});

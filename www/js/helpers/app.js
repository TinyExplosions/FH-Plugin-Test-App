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
    window.onerror = function(msg, url, linenumber) {
        alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
        return true;
    };
    stethoscope = new Stethoscope();

    var initialize = function() {

        this.vent = new _.extend({}, Backbone.Events);
        this.Page = new PageHelper.pageTransition();

        this.VersionInfo = {
            Client: 'x.y.z',
            Cloud: 'development',
            AppName: 'Template App'
        }
        
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification.badge) {
            cordova.plugins.notification.badge.promptForPermission();
        }
        if (typeof LocalFileSystem !== 'undefined') {
            function onFS(fs) {
                //leave in for now for debug
                // alert(fs.root.fullPath);
                App.filesystem = fs;
                App.fileroot = fs.root.toURL();
            }
            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFS, null);
        }

        if (typeof(AppVersion) !== "undefined") {
            this.VersionInfo.Client = AppVersion.version;
        }

        this.Connection = new ConnectivityFSM({
            stethoscope: stethoscope
        });
        ConnectionHelper.initialize();

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

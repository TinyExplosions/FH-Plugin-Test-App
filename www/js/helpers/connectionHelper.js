// Filename: utils.js
define([
    'jquery',
    'backbone',
    'socketio'
], function($, Backbone, io) {
    var initialize = function() {
        App.Connection.on("transition", transition, this);
        App.Connection.goOnline();
    };

    var socketSetup = function() {
        App.Socket = io.connect($fh.getCloudURL(), {
            'reconnection': true
        });
        App.Connection.on("transition", socketTransition, this);
        App.Socket.on('connect', function() {
            App.vent.trigger("socket:connect");
        });
        App.Socket.on('update', function(data) {
            App.vent.trigger("socket:update", data);
        });
        App.Socket.on('disconnect', function() {
            App.vent.trigger("socket:disconnect", {});
        });
    };

    var socketTearDown = function() {
        if (App.Socket) {
            App.Socket.close();
            App.Socket = null;
            App.Connection.off("transition", socketTransition, this);
        }
    };

    var socketTransition = function(data) {
        // console.log("transition!");
        // Adding timeout to handle iOS `resume` event funkiness
        // see http://docs.phonegap.com/en/4.0.0/cordova_events_events.md.html#resume
        setTimeout(function() {
            console.log("Transition", data);
            if (data.toState === "online") {
                socketReconnect();
            }
            if (data.toState === "offline") {
                socketTearDown();
            }
        }, 0);
    };

    var socketReconnect = function() {
        if (!App.Socket) {
            socketSetup();
        } else {
            if (!App.Socket.connected) {
                App.Socket.connect();
            }
        }
    };

    var transition = function(data) {
        console.log("Transition", data);
        if (data.toState == "online") {}
    };

    return {
        initialize: initialize,
        socketSetup: socketSetup,
        socketTearDown: socketTearDown
    };
});

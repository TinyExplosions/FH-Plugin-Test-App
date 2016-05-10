define([
    'backbone',
    'jquery'
], function(Backbone, $) {

    var Stethoscope = function(heartbeatDef) {
        this.sessionToken = "";
        this.settings = $.extend({
            path: '/heartbeat',
            method: 'GET',
            contentType: 'application/json',
            timeout: 5000
        }, heartbeatDef);
    };

    $.extend(Stethoscope.prototype, Backbone.Events, {
        checkHeartbeat: function() {
            var self = this;
            self.trigger('checking-heartbeat');
            $fh.cloud(self.settings, function(response) {
                if(response.version && App.VersionInfo) {
                  App.VersionInfo.Cloud = response.version;
                }
                self.trigger('heartbeat');
            }, function(msg, err) {
                self.trigger('no-heartbeat');
            });
        }
    });

    $.extend(Stethoscope.prototype, Backbone.Events, {
        checkAuthentication: function() {
            var self = this;
            console.log("checking auth");
            self.settings.data.sessionId = this.sessionToken
            self.trigger('checking-authenticated');
            $fh.cloud(self.settings, function(response) {
                self.trigger('aunthenticated');
            }, function(msg, err) {
                self.trigger('not-authenticated');
            });
        }
    });

    return Stethoscope;
});
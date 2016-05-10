define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/AssortedTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'render');
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification.badge) {
                cordova.plugins.notification.badge.promptForPermission();
            }
        },

        events: {
            'submit .badgeForm': 'badgeSubmit'
        },

        render: function() {
            App.BaseView.Header.model.set('title', 'Other Plugins');
            var compiled = _.template(Template);
            var compiledTemplate = compiled({});
            this.$el.html(compiledTemplate);
            return this;
        },

        badgeSubmit: function(evt) {
            
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.notification.badge) {
                var items = this.$el.find('.badgeNum').val();
                console.log("set badge to", items);
                cordova.plugins.notification.badge.set(items);
            }
            return false;
        },

        onClose: function() {}

    });

    return View;

});

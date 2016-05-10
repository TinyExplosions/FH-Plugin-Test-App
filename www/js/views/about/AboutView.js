define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/AboutTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'render');
        },

        events: {
        },

        render: function() {
            App.BaseView.Header.model.set('title', 'About');
            var compiled = _.template(Template);
            var compiledTemplate = compiled({version: App.VersionInfo.Client});
            this.$el.html(compiledTemplate);
            return this;
        },
       
        onClose: function() {
        }

    });

    return View;

});

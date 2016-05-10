define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/FileTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'render');
        },

        events: {
        },

        render: function() {
            App.BaseView.Header.model.set('title', 'Base');
            var compiled = _.template(Template);
            var compiledTemplate = compiled({});
            this.$el.html(compiledTemplate);
            return this;
        },
       
        onClose: function() {
        }

    });

    return View;

});

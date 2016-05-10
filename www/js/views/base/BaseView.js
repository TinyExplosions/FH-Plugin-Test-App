define([
    'jquery',
    'underscore',
    'backbone',
    'models/BaseModel',
    'text!templates/BaseTemplate.html',
    'views/base/HeaderView'
], function($, _, Backbone, BaseModel, BaseTemplate, HeaderView) {

    var BaseView = Backbone.View.extend({
        el: 'body',
        model: new BaseModel(),

        initialize: function(options) {
            _.bindAll(this, 'render', 'onClose', 'hideNav', 'enableScroll', 'disableScroll');
            App.vent.on('nav:open', this.disableScroll);
            App.vent.on('nav:closed', this.enableScroll);
            this.render();
        },

        events: {
            'swipe .wrapper': 'onSwipe',
            'swipe .navigation.is-visible~.obfuscator': 'onSwipe',
            'tap .navigation.is-visible~.obfuscator': 'hideNav'
        },

        preRender: function(callback) {
            // this.model.fetch().done(function(){console.log("done")});
            setTimeout(function() {
                console.log("Prerender complete!");
                callback("onStartupComplete.");
            }, 1000);
        },

        render: function() {
            var attrs = this.model.attributes;
            var compiled = _.template(BaseTemplate);
            var compiledTemplate = compiled(attrs);
            this.$el.html(compiledTemplate);
            this.Header = new HeaderView();
            this.$el.hammer();
            return this;
        },

        hideNav: function() {
            App.vent.trigger('nav:closed');
        },

        onSwipe: function(evt) {
            if (evt.type !== "swipe") {
                return;
            }
            if (evt.gesture.direction === "right" && evt.gesture.center.pageX < 350) {
                App.vent.trigger('nav:open');
            }
            if (evt.gesture.direction === "left" && this.$el.find('.navigation').hasClass('is-visible')) {
                App.vent.trigger('nav:closed');
            }
        },

        enableScroll: function() {
            this.$el.removeClass('no-scroll').unbind('touchmove');
        },

        disableScroll: function() {
            this.$el.addClass('no-scroll').bind('touchmove', function(e) {
                e.preventDefault()
            });
        },

        onClose: function() {
            App.vent.off('nav:closed', this.enableScroll);
            App.vent.off('nav:open', disableScroll);
            if (this.Header.onClose) {
                this.Header.onClose();
            }
        }

    });

    return BaseView;

});

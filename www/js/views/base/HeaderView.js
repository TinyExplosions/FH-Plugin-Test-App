define([
    'underscore',
    'backbone',
    'models/HeaderModel',
    'text!templates/HeaderTemplate.html',
    'views/navigation/NavigationView'
], function(_, Backbone, HeaderModel, HeaderTemplate, NavigationView) {

    var HeaderView = Backbone.View.extend({
        el: 'header',
        model: new HeaderModel(),

        initialize: function(options) {
            _.bindAll(this, 'render', 'modelChange', 'onClose', 'navChange', 'navBtnTap', 'hamburgerTap', 'navMaskSwipe', 'clearSearch', 'closeNav');
            this.model.bind('change', this.modelChange);
            App.vent.on("collection:search:clear", this.clearSearch);
            App.vent.on('nav:closed', this.closeNav);
            new NavigationView();
            this.render();
        },

        events: {
            'tap .toggleMenu': 'toggleMenu',

            'tap .searchicon': 'dosearch',
            'tap .arrow': 'arrowTap',
            'tap .navBtn': 'navBtnTap',
            'tap .hamburger': 'hamburgerTap',
            'keyup .search': 'searchChange'
        },

        render: function() {
            document.title = this.model.get("title");
            // var compiledTemplate = _.template(HeaderTemplate, this.model.attributes);
            var compiled = _.template(HeaderTemplate);
            var compiledTemplate = compiled(this.model.attributes);
            this.$el.html(compiledTemplate);
            this.$el.hammer();
            return this;
        },

        toggleMenu: function(evt) {
            var $navigation = $('.navigation');
            if ($navigation.hasClass('is-visible')) {
                App.vent.trigger('nav:closed');
            } else {
                App.vent.trigger('nav:open');
            }
        },

        closeNav: function() {

        },

        dosearch: function() {
            this.$el.find('.searchicon').fadeOut('slow');
            var $hamburger = this.$el.find('.multi-icon');
            var className = "multi-icon hamburger";
            if ($hamburger.hasClass(className)) {
                className = "multi-icon arrow";
                this.$el.find('.title').fadeOut();
                this.$el.find('.search').fadeIn('slow', function() {
                    $(this).focus();
                }).css("display", "");
            }
            $hamburger.attr('class', className);
        },

        clearSearch: function() {
            var $search = this.$el.find('.search');
            $search.val('').trigger('keyup');
            $search.blur();
        },

        modelChange: function(model, opts) {
            var changed = model.changed;
            if (typeof changed.open !== 'undefined') {
                this.navChange();
            } else {
                this.render()
            }
        },

        searchChange: function(evt) {
            var searchTerm = $(evt.target).val();
            App.vent.trigger("collection:search", searchTerm);
        },

        arrowTap: function(evt) {
            var $hamburger = this.$el.find('.multi-icon');
            $hamburger.prop('class', 'multi-icon hamburger');
            this.$el.find('.searchicon').fadeIn('slow').css("display", "");
            this.$el.find('.search').css("display", "none");
            setTimeout(function() {
                this.$el.find('.title').fadeIn('slow').css("display", "");
                this.clearSearch();
            }.bind(this), 1);


        },

        goBack: function() {
            App.ReverseTransition = true;
            window.history.back();
        },

        navChange: function() {
            if (this.model.get('open')) {
                $('body').append('<div class="navigationMask"></div>').addClass('open');
                setTimeout(function() {
                    $('.open .navigationMask').hammer();
                    $('.open .navigationMask').bind('tap', this.hamburgerTap);
                    $('.open .navigationMask').bind('swipe', this.navMaskSwipe);
                    $('.navigation').scrollTop(0);
                }.bind(this), 400);
            } else {
                $('.open .navigationMask').unbind('tap', this.hamburgerTap);
                $('.open .navigationMask').bind('swipe', this.navMaskSwipe);
                $('body').removeClass('open');
                setTimeout(function() {
                    $('.navigationMask').remove();
                    $('.navigation').scrollTop(0);
                }.bind(this), 500);
            }
        },

        navBtnTap: function(e) {
            this.model.set('open', !this.model.get('open'));
        },

        navMaskSwipe: function(evt) {
            if (evt.gesture.direction === 'left') {
                this.model.set('open', !this.model.get('open'));
            }
        },

        hamburgerTap: function(e) {
            e.stopPropagation();
            this.model.set('open', !this.model.get('open'));
        },

        onClose: function() {
            App.vent.off("collection:search:clear", this.clearSearch);
            App.vent.off('nav:closed', this.closeNav);
        }

    });

    return HeaderView;

});

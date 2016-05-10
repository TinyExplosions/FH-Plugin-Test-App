define([
    'underscore',
    'backbone',
    'models/HeaderModel',
    'text!templates/NavigationTemplate.html',
    'views/alert/AlertView'
], function(_, Backbone, HeaderModel, NavigationTemplate, AlertView) {

    var NavigationView = Backbone.View.extend({
        el: '.navigation',
        model: new HeaderModel(),

        initialize: function(options) {
            _.bindAll(this, 'render', 'showVersionInfo', 'onClose', 'showNav', 'hideNav');
            // this.model.bind('change', this.modelChange);
            App.vent.on('nav:closed', this.hideNav);
            App.vent.on('nav:open', this.showNav);
            this.user = {};
            this.render();
        },

        events: {
            'tap li': 'followLink',
            'click li': 'followLink',
            'swipe .versionInfo': 'showVersionInfo'
        },

        render: function() {
            // var width = $(window).width() - 56;
            var attrs = this.model.attributes;
            attrs.sessionUser = this.user;
            attrs.version = App.VersionInfo.Client;
            attrs.appName = App.VersionInfo.AppName;
            var compiled = _.template(NavigationTemplate);
            var compiledTemplate = compiled(attrs);
            this.$el.html(compiledTemplate);
            // this.$el.find('.heroImage').height((width / 16) * 9);
            this.$el.hammer();
            // Waves.attach(this.$el.find('ul')[0]);
            // Waves.init();
            return this;
        },

        followLink: function(evt) {
            if ($(evt.target).hasClass('versionInfo')) {
                return;
            }
            evt.stopPropagation();
            if (!$('body').hasClass('no-scroll')) {
                return false;
            }
            App.vent.trigger('nav:closed');
            var target = $(evt.target).closest('a').attr('href');
            App.BaseView.Header.model.set('open', false);
            Backbone.history.navigate(target, {
                trigger: true
            });
            return false;
        },

        showVersionInfo: function(evt) {
            var AppInfo = $fh.getFHParams();
            AppInfo.ClientVersion = App.VersionInfo.Client;
            AppInfo.CloudVersion = App.VersionInfo.Cloud;
            AppInfo.CloudPath = $fh.getCloudURL();
            evt.stopPropagation();
            console.log("App Version", AppInfo);
            var dialogText = "<strong>App Version:</strong> " + AppInfo.ClientVersion;
            dialogText += "<br><strong>Cloud Version:</strong> " + AppInfo.CloudVersion;
            dialogText += "<br><strong>AppId:</strong> " + AppInfo.appid;
            dialogText += "<br><strong>ProjectId:</strong> " + AppInfo.projectid;
            dialogText += "<br><strong>Cloud Path:</strong> " + AppInfo.CloudPath;
            new AlertView({
                title: App.VersionInfo.AppName,
                dialogText: dialogText,
                cancelBtn: ':none:'
            });
            App.vent.trigger('nav:closed');
            return false;
        },

        showNav: function() {
            this.$el.addClass('is-visible');
        },

        hideNav: function() {
            this.$el.removeClass('is-visible');
        },

        closeView: function() {
            App.vent.off('nav:closed', this.hideNav);
            App.vent.off('nav:open', this.showNav);
            App.BaseView.Header.model.set('open', false);
        },

        onClose: function() {}

    });

    return NavigationView;

});

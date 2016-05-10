define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/AssortedTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        initialize: function(options) {
            localStorage.removeItem('docDownloaded');
            _.bindAll(this, 'render', 'downloadDoc', 'downloadSuccess', 'downloadError', 'deleteSuccess');
        },

        events: {
            'submit .badgeForm': 'badgeSubmit',
            'tap .download': 'downloadDoc',
            'tap .deleteDoc': 'deleteDoc',
            'tap .showDoc': 'showDoc'
        },

        render: function() {
            App.BaseView.Header.model.set('title', 'Other Plugins');
            var compiled = _.template(Template);
            var compiledTemplate = compiled({ docDownloaded: localStorage.getItem("docDownloaded") });
            this.$el.html(compiledTemplate);
            this.$el.hammer();
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

        downloadDoc: function(evt) {
            $(evt.target).text("Downloading...");
            if (App.filesystem) {
                App.filesystem.root.getFile('testDoc.pdf', {
                        create: true,
                        exclusive: false
                    },
                    function(file_entry) {
                        var fileTransfer = new FileTransfer();
                        var url = encodeURI($fh.getCloudURL() + '/download');
                        fileTransfer.download(
                            url,
                            file_entry.toURL(),
                            function(entry) {
                                this.downloadSuccess(file_entry.toURL());
                            }.bind(this),
                            function(error) {
                                this.downloadError(error);
                            }.bind(this),
                            false, {}
                        )
                    }.bind(this));
            } else {
                setTimeout(function() {
                    this.downloadSuccess($fh.getCloudURL() + '/download');
                }.bind(this), 3000);
            }
        },

        deleteDoc: function() {
            if (App.filesystem) {
                App.filesystem.root.getFile(localStorage.getItem("docDownloaded"), {},
                    function(file_entry) {
                        file_entry.remove(this.deleteSuccess, this.downloadError);
                    }.bind(this));
            } else {
              this.deleteSuccess();
            }
        },

        showDoc: function(evt) {
          var url = localStorage.getItem("docDownloaded");
          if(url) {
            window.open(url, '_blank', 'location=yes,enableViewportScale=yes,toolbarposition=top');
          } else {
            if(navigator.notification && navigator.notification.alert) {
              navigator.notification.alert("You don't seem to have downloaded the document yet. On the plus side, the cordova-plugin-dialogs plugin looks to be working!", function(){}, 'Oh Dear', 'Boo');
            } else {
              alert("You don't seem to have downloaded the document yet");  
            }
          }
        }, 

        deleteSuccess: function() {
            localStorage.removeItem('docDownloaded');
            this.render();
        },

        downloadSuccess: function(entryUrl) {
            localStorage.setItem("docDownloaded", entryUrl);
            this.render();
        },

        downloadError: function(err) {
            alert(err);
        },

        onClose: function() {}

    });

    return View;

});

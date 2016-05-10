define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/ConfirmTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({
        tagName: 'div',
        className: 'confirmationView',

        initialize: function(options) {
            _.extend(this, _.pick(options, "title", "dialogText", "okBtn", "cancelBtn", "onClose", "onCancel", "maskTapped"));
            _.bindAll(this, 'render');
            $('body').addClass('no-scroll').bind('touchmove', function(e) {
                e.preventDefault()
            });
            this.render();
        },

        events: {
            'tap .okBtn': 'dismissOK',
            'tap .cancelBtn': 'dismissCancel',
            'tap': 'maskTapped'
        },

        render: function() {
            var attrs = {
                title: this.title || false,
                dialogText: this.dialogText || "Blank Dialog",
                okBtn: this.okBtn || "Ok",
                cancelBtn: this.cancelBtn || "Cancel"
            }
            var compiled = _.template(Template);
            var compiledTemplate = compiled(attrs);
            this.$el.html(compiledTemplate);
            $('.confirmationView').remove();
            this.$el.hide().appendTo('body').fadeIn('fast');
            // $('body').append(this.$el);
            setTimeout(function() {
                var $box = this.$el.find('.confirmBox');
                $box.css({
                    'margin-top': '-' + ($box.innerHeight() / 2).toString() + 'px'
                });
            }.bind(this), 0);
            this.$el.hammer();
            return this;
        },

        maskTapped: function(evt) {
            if ($(evt.target).hasClass('confirmationView')) {
              console.log("tapped");
              this.dismissCancel();
            }
            
        },

        dismissOK: function() {
            if (this.onClose) {
                this.onClose()
            }
            this.onDestroy();
        },
        dismissCancel: function() {
            if (this.onCancel) {
                this.onCancel()
            }
            this.onDestroy();
        },

        onDestroy: function() {
            this.$el.fadeOut(function() {
                $('body').removeClass('no-scroll').unbind('touchmove');
                $(this).remove()
            });
        }

    });

    return View;

});

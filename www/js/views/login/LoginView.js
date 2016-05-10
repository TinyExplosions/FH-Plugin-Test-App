define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/LoginTemplate.html'
], function($, _, Backbone, LoginTemplate) {

    var LoginView = Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'render');
            this.user = {}
            this.render();
        },

        events: {
            'submit form': 'formSubmit',
            'focus input': 'inputFocus',
            'blur input': 'inputBlur',
            'keyup input': 'keyup'
        },

        render: function() {
            if (!this.user) {
                this.user = {
                    userName: ""
                };
            }
            $('header').children().addClass('hidden');
            App.BaseView.$el.find('.loginWrapper').remove();
            this.$el.addClass('loginWrapper hidden');
            var compiledTemplate = _.template(LoginTemplate, this.user);
            this.$el.html(compiledTemplate);
            App.BaseView.$el.append(this.$el);
            this.$el.animate({
                opacity: 1
            }, 'fast');
            var $box = this.$el.find('.loginBox');
            $box.css({
                'margin-top': '-' + ($box.height() / 2).toString() + 'px'
            });
            return this;
        },

        formSubmit: function(evt) {
            console.log("submit!?");
            evt.preventDefault();
            var $btn = this.$el.find('button');
            var btnText = $btn.text();
            $btn.text('Loading...');
            $btn.prop('disabled', true);
            this.hideErrors();
            var errors = [];
            var username = this.$el.find('#username').val();
            var password = this.$el.find('#password').val();
            if (username === "") {
                errors.push({
                    name: 'username',
                    message: 'Please enter your username'
                });
            }
            if (password === "") {
                errors.push({
                    name: 'password',
                    message: 'Please enter your password'
                });
            }
            if (errors.length > 0) {
                this.showErrors(errors);
                $btn.text(btnText);
                return false;
            }
            Session.login({
                userName: username,
                userPassword: password
            }, function(err, res) {
                if (err) {
                    $btn.parent().before('<p class="loginerror">' + err + '</p>');
                    $btn.prop('disabled', false).text(btnText);
                    this.$el.find('.loginerror').focus();
                    return false
                } else {
                    this.onClose();
                }
            }.bind(this));
        },

        keyup: function(evt) {
            var $input = $(evt.target);
            if($input.val() !== '') {
                $input.closest('.form-group').find('.help-inline').text('');
                $input.closest('.form-group').removeClass('error');
            }
            // var username = this.$el.find('#username').val()
            // var password = this.$el.find('#password').val()
            // this.$el.find('button').prop('disabled', (username === "" || password === ""));
        },

        inputFocus: function(evt) {
            $(evt.target).closest('.form-group').addClass('focussed');
            $(evt.target).next('label').addClass('active');
        },

        inputBlur: function(evt) {
            var $input = $(evt.target);
            $input.closest('.form-group').removeClass('focussed');
            if($input.val()=== "") {
                $input.next('label').removeClass('active');
            }
        },

        showErrors: function(errors) {
            _.each(errors, function(error) {
                var controlGroup = this.$el.find('.' + error.name);
                controlGroup.addClass('error');
                controlGroup.find('.help-inline').text(error.message);
            }, this);
            var position = this.$el.find('.error').position();
            window.scrollTo(0, position.top);
            this.$el.find('button').prop('disabled', false);
        },

        hideErrors: function() {
            this.$el.find('.loginerror').remove();
            this.$el.find('.form-group').removeClass('error');
            this.$el.find('.help-inline').text('');
        },

        onClose: function() {
            $('header').children().removeClass('hidden');
            this.$el.addClass('transition stage-left');
            setTimeout(function() {
                this.$el.remove();
            }.bind(this), 550);
        }

    });

    return LoginView;

});

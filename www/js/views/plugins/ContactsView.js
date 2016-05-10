define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/ContactsTemplate.html'
], function($, _, Backbone, Template) {

    var View = Backbone.View.extend({

        initialize: function(options) {
            _.bindAll(this, 'render', 'onSuccess');
        },

        events: {
            'keyup .searchfield': 'performsearch',
            'submit': 'formSubmit',
            'tap a': 'callContact'
        },

        render: function() {
            App.BaseView.Header.model.set('title', 'Contacts');
            var compiled = _.template(Template);
            var compiledTemplate = compiled({});
            this.$el.html(compiledTemplate);
            this.$el.hammer();
            this.performsearch();
            return this;
        },

        performsearch: function(evt) {
            var term = this.$el.find(".searchfield").val();
            var options = new ContactFindOptions();
            options.filter = term;
            options.multiple = true;
            var fields = ["displayName", "name", "phoneNumbers"];
            navigator.contacts.find(fields, this.onSuccess, this.onError, options);
        },

        onSuccess: function(contacts) {
            var $list = this.$el.find('.contacts');
            // $list.empty();
            $list.fadeOut('fast', function() {
                $list.empty();



                // var startLetter = "A";
                contacts = _.sortBy(contacts, function(contact) {
                    return contact.name.formatted; });
                // var divider = '<li class="table-view-cell table-view-divider">'+startLetter+'</li>';
                // alert("Found "+contacts.length+" results");
                // if(contacts.length > 0 && contacts[0].name.formatted[0].toUpperCase() == startLetter) {
                //     $list.append(divider);
                // }
                // $list.append("<pre>" + JSON.stringify(contacts,null,2) + "</pre>");
                for (var i = 0; i < contacts.length; i++) {
                    var contact = contacts[i];
                    // var anchor = '<li class="table-view-cell"><a><span class="pull-left icon icon-user"></span>'+contact.name.formatted+'</a></li>';
                    // if(!contact.name.formatted) {
                    //     anchor = '<li class="table-view-cell"><pre>'+JSON.stringify(contact,null,2)+'</pre></li>';
                    // }
                    if (contact.name.formatted && contact.phoneNumbers) {
                        var anchor = '<li class="table-view-cell"><a href="tel:' + contact.phoneNumbers[0].value + '"><span class="pull-left icon icon-user"></span>' + contact.name.formatted + '<br />' + contact.phoneNumbers[0].value + '</a></li>';
                        $list.append(anchor);
                    }
                    // if(contact.name.formatted[0].toUpperCase() !== startLetter) {
                    //     startLetter = contact.name.formatted[0].toUpperCase();
                    //     divider = '<li class="table-view-cell table-view-divider">'+startLetter+'</li>';
                    //     $list.append(divider);
                    // }
                    // $list.append(anchor);
                }
                $list.fadeIn('fast');
            }.bind(this));
        },

        onError: function(contactError) {
            console.log("Conact Error you know", contactError);
        },

        callContact: function(evt) {
            this.$el.find('input').blur();
        },

        onClose: function() {}

    });

    return View;

});

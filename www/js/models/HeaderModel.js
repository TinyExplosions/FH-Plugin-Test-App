define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var HeaderModel = Backbone.Model.extend({
        // Default values.
        defaults : {
            title: "APP NAME HERE",
            backBtn: false,
            editBtn: false
        }
    });
    return HeaderModel;
});
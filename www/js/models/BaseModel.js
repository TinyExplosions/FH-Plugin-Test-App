define([
    'underscore',
    'backbone'
], function(_, Backbone) {
    var BaseModel = Backbone.Model.extend({

        url: $fh.getCloudURL()+'/appInfo',
        
        defaults : {
            Client: 'x.y.z',
            Cloud: 'development',
            AppName: 'Template App'
        }
        
    });
    return BaseModel;
});
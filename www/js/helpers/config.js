require.config({
    baseUrl: "js",
    paths: {
        jquery: 'libs/jquery/jquery',
        underscore: 'libs/lodash/lodash.min',
        // underscore: 'libs/underscore/underscore',
        backbone: 'libs/backbone/backbone',
        machina: 'libs/machina/machina',
        backbone_dualstorage: 'libs/backbone/backbone.dualstorage',
        hammer: 'libs/hammer/hammer',
        moment: 'libs/moment/moment.min',
        templates: '../templates',
        text: 'libs/require/text',
        stethoscope: 'libs/utils/stethoscope',
        connectivityFSM: 'libs/utils/connectivityFSM',
        socketio: 'libs/socket.io/socket.io'
    },
    shim: {
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        'backbone_dualstorage': {
            deps: ['backbone']
        },
        'underscore': {
            exports: '_'
        },
        'hammer': {
            deps: ['jquery']
        },
        'socketio': {
            exports: 'io'
        }
    },
    config: {
        moment: {
            noGlobal: true
        }
    }
});

require([
    'helpers/app', 'hammer', 'backbone_dualstorage'
], function(App, Hammer) {
    window.App = App;
    App.initialize();
}); 

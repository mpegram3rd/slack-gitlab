var Hapi = require("hapi");
var mergeHandler = require('./gitlab/mergehandler.js');
var gitlabClient = require('./gitlab/client.js');

var server = new Hapi.Server();
server.connection({port: 8889});

// JSON response from a POST update.
server.route ({
    path: "/slack-gitlab/MR/{projRepo}",
    method: "POST",
    config: {
        pre : [
            { method: gitlabClient.preHandlerProjectDetails, assign: 'projDetails' }

        ],
        handler: mergeHandler.handler
    }
});

// Meme server
server.route({
    method: 'GET',
    path: '/slack-gitlab/memes/{param*}',
    handler: {
        directory : {
            path: 'meme-images'
        }
    }
});

// Simple logging
server.on("log", function (event, tags) {
    var tagsJoined = Object.keys(tags).join();
    var message = event.data;
    console.log("Log entry [" + tagsJoined + "] (" + (message || "") + ")");
});

// Log Requests
server.on('request', function (request, event, tags) {
    console.log("Route: " + request.path );

});

// Notify if anything really bad happens
server.on('internalError', function (request, error) {
    console.log ('Internal Error on path: ' + request.path + ' caused by: ' + error.message);
});

// Log the listen URL
server.start(function() {
    console.log("Gitlab Slackbot listening @ " + server.info.uri);
});


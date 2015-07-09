var unirest = require("unirest");
var config = require('./config.js');

exports.preHandlerProjectDetails = function (req, reply) {
    var projectId = req.payload.object_attributes.source_project_id;
    var action = req.payload.object_attributes.state;
    if (action === "opened") {
        unirest.get(config.gitlabAPIBase + '/projects/' + projectId)
            .strictSSL(false)
            .header('Accept', 'application/json')
            .header('PRIVATE-TOKEN', config.gitlabPrivateToken)
            .end(function (response) {
                // Something went wrong.. log it.
                if (response.statusCode > 200)
                    console.log("[Gitlab Error Response]: " + response.body);
                else {
                    var projectDetails = new Object();
                    projectDetails.id = response.body.id;
                    projectDetails.webUrl = response.body.web_url;

                    console.log('Project details retrieved: ' + JSON.stringify(projectDetails));
                    reply(projectDetails);
                }

            });
    }
    reply ();
}

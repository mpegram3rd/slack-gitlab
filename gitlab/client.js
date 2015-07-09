var unirest = require("unirest");
var config = require('./config.js');

var projectCache = new Object();
projectCache.ttl = config.projectCacheTTL;

exports.preHandlerProjectDetails = function (req, reply) {
    var projectId = req.payload.object_attributes.source_project_id;
    var action = req.payload.object_attributes.state;
    if (action === "opened" || action == "reopened") {
        var projectDetails = cachedProjectDetails(projectId);
        if (!projectDetails) {
            console.log('Cache Miss... looking up project on Gitlab: ' + projectId);
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
                        projectDetails.name = response.body.path_with_namespace;
                        projectDetails.webUrl = response.body.web_url;
                        projectDetails.lastUpdated = Date.now();

                        projectCache[projectId] = projectDetails;
                        reply(projectDetails);
                    }

                });
        }
        else {
            reply(projectDetails);
        }
    }
    else {
        reply();
    }
};

function cachedProjectDetails(projectId) {
    var cachedValue = projectCache[projectId];
    if (cachedValue) {
        if (Date.now() - cachedValue.lastUpdated > projectCache.ttl)
            cachedValue = null;
    }

    return cachedValue;
};

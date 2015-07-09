var unirest = require("unirest");
var config = require('./config.js');

exports.handler = function(req, reply) {
    console.log("MR issued for repo: " + req.params.projRepo);
    console.log("Payload\n=========\n" + JSON.stringify(req.payload));
    var projectDetails = req.pre.projDetails;
    var mergeDetails = req.payload.object_attributes;
    if (projectDetails && mergeDetails) {
        var targetURL = projectDetails.webUrl + '/merge_requests/' + mergeDetails.iid;
        console.log('View merge request at: ' + targetURL);
        var webhookMessage = {
            text : '*Merge Request:* ' + projectDetails.name
            + ' *From:* ' + mergeDetails.source_branch
            + ' *To:* ' + mergeDetails.target_branch
            + '\n<' + targetURL +'>',
            channel : config.slackChannel,
            attachments : [
                {
                    image_url : 'http://blog.klocwork.com/wp-content/uploads/2009/11/sally-code-review-300x257.png'
                }
            ]
        };
        unirest.post(config.slackWebhookUrl)
            .header('Accept', 'application/json')
            .send("payload=" + JSON.stringify(webhookMessage))
            .end(function (response) {
                // Something went wrong.. log it.
                if (response.statusCode > 200)
                    console.log("[Slack Error Response]: " + response.body);
            });

    }
    reply();
};
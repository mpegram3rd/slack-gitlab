var unirest = require("unirest");
var config = require('./config.js');

exports.handler = function(req, reply) {
    var projectDetails = req.pre.projDetails;
    var mergeDetails = req.payload.object_attributes;
    if (projectDetails && mergeDetails) {
        var targetURL = projectDetails.webUrl + '/merge_requests/' + mergeDetails.iid;
        var webhookMessage = {
            text : '*Title:* ' + mergeDetails.title
            + '\n*Merge Request:* ' + projectDetails.name
            + ' *From:* ' + mergeDetails.source_branch
            + ' *To:* ' + mergeDetails.target_branch
            + ' ' + (mergeDetails.target_branch === 'master' ? ' *:bangbang: ALERT! MASTER BRANCH MERGE :bangbang:*' : '')
            + '\n<' + targetURL +'>',
            channel : config.slackChannel,
            attachments : [
                {
                    title : 'merge-meme',
                    image_url : pickAnImage(config.memes)

                }
            ]
        };
        console.log('[New Merge Request]: ' + targetURL);
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

function pickAnImage(memes) {
    return memes[Math.floor(Math.random() * memes.length)];
}
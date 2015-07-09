var unirest = require("unirest");

exports.handler = function(req, reply) {
    console.log("MR issued for repo: " + req.params.projRepo);
    console.log("Payload\n=========\n" + JSON.stringify(req.payload));
    var projectDetails = req.pre.projDetails;
    if (projectDetails) {
        var targetURL = projectDetails.webUrl + '/merge_requests/' + req.payload.object_attributes.iid;
        console.log('View merge request at: ' + targetURL);
    }
    reply();
};
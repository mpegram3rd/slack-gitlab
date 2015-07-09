var unirest = require("unirest");

exports.handler = function(req, reply) {
    console.log("MR issued for repo: " + req.params.projRepo);
    console.log("Payload\n=========\n" + JSON.stringify(req.payload));
    var targetURL = "http://"
    reply();
};
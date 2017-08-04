'use strict';

let exports = module.exports = {};

exports.handle = function(request, callback, core) {
    console.log("Handling DigitalPromoIntent");

    let cardTitle = request.intent.name;
    let repromptText = "How can I help?";
    let sessionAttributes = {
        anythingElseEnabled : true
    };
    let shouldEndSession = true;
    let speechOutput = "";

    let attributes = request.intent.slots;

    let schedule = [];
    let promises = [];
    // let network = core.getNetwork(attributes);
    core.getPromo(attributes).then((data, err) => {
        speechOutput = data;
    });
}
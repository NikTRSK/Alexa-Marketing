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
    speechOutput = core.getPromo(attributes);

    // // if date is not mentioned, it should be considered implicitly today
    // if ((!attributes.Date || !attributes.Date.value) && (attributes.Time && attributes.Time.value)) {
    //     attributes.Date = {
    //         name : "Date",
    //         value : core.formatDate(new Date(), 'YYYY-MM-DD')
    //     };
    // }
}
'use strict';

// let search = require('./search.js');

let exports = module.exports = {};
let db = require('./db_util')
// let moment = require('moment');
let AWS = require("aws-sdk");
AWS.config.update({
	region: "us-east-1"
});
let docClient = new AWS.DynamoDB.DocumentClient();

exports.constants = {
	APPNAME: "GUIDE",

	NBC_NETWORK: "NBC",
	ABC_NETWORK: "ABC",
	CBS_NETWORK: "CBS",
	FOX_NETWORK: "FOX",
	CW_NETWORK: "CW",

	LEAD_IN: "LEAD IN",
	LEAD_OUT: "LEAD OUT",

	NEXT: 'next',
	LAST: 'last',

	PAST: -1,
	PRESENT: 0,
    FUTURE: 1,

    WHEN: 'WHEN',
    WHERE: 'WHERE',
    WHEN_WHERE: 'WHEN AND WHERE'
};

// --------------- Helpers that build all of the responses -----------------------

exports.buildSpeechletResponse = function(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

exports.buildResponse = function(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}

exports.increaseRepromptCounter = function(session) {
	if (session.repromptCounter) session.repromptCounter++;
	else session.repromptCounter = 1;
};

exports.getPromo = function(attributes) {
    let returnedContent = {
		text: "Sorry, something went wrong. Try again later.",
		shouldEndSession: true
	};

    const time_direction = attributes.time_direction;
    const video_title = attributes.video_title;

    let speechOutput = null;
    if (time_direction && video_title && time_direction.value && video_title.value) {
        const promo = db.getPromo(video_title);

        if (promo.length == 0) return null;
        const air_date = promo['On-Air Date'];
        const digital_paltform = promo['Digital Platform'];

        if (time_direction.value.toLowerCase() == constants.WHEN.toLowerCase()) {
            speechOutput = video_title + " aired on " + air_date;
        } else if (time_direction.value.toLowerCase() == constants.WHERE.toLowerCase()) {
            if (digital_paltform == 'n/a')
                speechOutput = "There is no platform information for " + video_title;
            else
                speechOutput = video_title + "aired on " + digital_paltform;
        } else if (time_direction.value.toLowerCase() == constants.WHEN_WHERE.toLowerCase()) {
            if (digital_paltform == 'n/a')
                speechOutput = "There is no platform information for " + video_title;
            
            speechOutput = video_title + " aired on " + digital_paltform + " on " + air_date;
        }
    }
    return speechOutput;
};
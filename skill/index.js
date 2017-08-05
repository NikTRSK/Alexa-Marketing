/*
    Quick sample for the Amazon Alexa RedCarpet skill app
*/
'use strict';

const Alexa = require('alexa-sdk');
// const core = require('core');
// var Data = require("./data.json");
const db = require('./db_util');
// const constants = require('./constants');

const constants = {
	WHEN: 'WHEN',
    WHERE: 'WHERE',
    WHEN_WHERE: 'WHEN AND WHERE'
};

const APP_ID = 'amzn1.ask.skill.6f8733a5-057c-42fd-958e-e8743d0db4d2'; // TODO replace with your app ID (OPTIONAL).

const skillName = "Digital Promo Skill";

var handlers = {
    "DigitalPromoIntent": function() {
        var speechOutput = "";

        // let returnedContent = {
        //     text: "Sorry, something went wrong. Try again later.",
        //     shouldEndSession: true
        // };

        const time_direction = this.event.request.intent.slots.TimeDirection;
        const video_title = this.event.request.intent.slots.PromoName;
        const show_name = this.event.request.intent.slots.ShowName;
        
        // Handle First 3 utterances (TimeDirection)
        if (time_direction && video_title && time_direction.value && video_title.value) {
            console.log("In if statement");
            db.getPromo(video_title.value).then((promo) => {
                console.log("in promise");
                if (promo.length == 0) return null;
                const air_date = promo[0]['On-Air_Date'];
                const digital_paltform = promo[0]['Digital_Platform'];
                console.log(constants.WHEN);
                console.log(promo);
                console.log(air_date);
                console.log(digital_paltform);
                if (time_direction.value.toLowerCase() == constants.WHEN.toLowerCase()) {
                    speechOutput = video_title.value + " aired on " + air_date;
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
                this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    speechOutput = "Error with promise";
                    this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
                }
            });
        }
        else if(video_title && promo && video_title.value && promo.value) {
            
        }
        else if (show_name) {
            db.getAllAvailablePromoTitlesForShow(show_name.value)
            .then(promo_titles => {
                speechOutput = "The available promos for " + show_name.value + " are " + promo_titles.join(', ');
                this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
            })
            .catch(err => {
                console.error(err);
                speechOutput = "Something went wrong."
                this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
            });
        }
        else {
            speechOutput = "Something went wrong.";
            this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
        }
    },

    "AboutIntent": function() {
        var speechOutput = "The Promo Skill is a property of NBC Universal and shouldn't be redistributed";
        this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
    },

    "AMAZON.HelpIntent": function() {
        var speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "Tell me something interesting about Java. ";
        speechOutput += "Tell me about the skill developer. ";
        speechOutput += "You can also say stop if you're done. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function() {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function() {
        var speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    'Unhandled': function() {
        this.emit(':ask', 'Insert your own error message here');
    },

    "LaunchRequest": function() {
        var speechText = "";
        speechText += "Welcome to " + skillName + ".  ";
        speechText += "You can ask a question like, tell me something interesting about Java.  ";
        var repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);
    }

};

exports.handler = function(event, context) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // alexa.appId = "amzn1.echo-sdk-ams.app.APP_ID";
    alexa.registerHandlers(handlers);
    alexa.execute();
};
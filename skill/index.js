/*
    Quick sample for the Amazon Alexa RedCarpet skill app
*/
'use strict';

const Alexa = require('alexa-sdk');
// const core = require('core');
// var Data = require("./data.json");
const db = require('./db_util');
// const constants = require('./constants');

let email = require('./send_email');
let json2xls = require('json2xls');

const constants = {
    WHEN: 'WHEN',
    WHERE: 'WHERE',
    WHEN_WHERE: 'WHEN AND WHERE'
};

const APP_ID = 'amzn1.ask.skill.6f8733a5-057c-42fd-958e-e8743d0db4d2'; // TODO replace with your app ID (OPTIONAL).

const skillName = "Digital Promo Skill";

var handlers = {
    "DigitalPromoIntent": function() {
        let speechOutput = "";

        // let returnedContent = {
        //     text: "Sorry, something went wrong. Try again later.",
        //     shouldEndSession: true
        // };

        const time_direction = this.event.request.intent.slots.TimeDirection;
        const video_title = this.event.request.intent.slots.PromoName;
        const show_name = this.event.request.intent.slots.ShowName;
        const start_date = this.event.request.intent.slots.StartDate;
        const end_date = this.event.request.intent.slots.EndDate;
        const length = this.event.request.intent.slots.Length;
        const air_date = this.event.request.intent.slots.AirDate;

        // Handle First 3 utterances (TimeDirection)
        if (time_direction && video_title && time_direction.value && video_title.value) {
            console.log("In if statement");
            db.getPromo(video_title.value).then((promo) => {
                    console.log("In get promo");
                    if (promo.length == 0) return null;
                    const air_date = promo[0]['AIR_DATE'];
                    const digital_paltform = promo[0]['DIGITAL_PLATFORM'];
                    if (time_direction.value.toLowerCase() == constants.WHEN.toLowerCase()) {
                        speechOutput = video_title.value + " aired on " + air_date;
                    } else if (time_direction.value.toLowerCase() == constants.WHERE.toLowerCase()) {
                        if (digital_paltform == 'n/a')
                            speechOutput = "There is no platform information for " + video_title;
                        else
                            speechOutput = video_title.value + "aired on " + digital_paltform;
                    } else if (time_direction.value.toLowerCase() == constants.WHEN_WHERE.toLowerCase()) {
                        if (digital_paltform == 'n/a')
                            speechOutput = "There is no platform information for " + video_title.value;

                        speechOutput = video_title.value + " aired on " + digital_paltform + " on " + air_date;
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
        } else if (video_title && show_name && video_title.value && show_name.value) {
            console.log("In is available to run");
            db.checkIfPromoIsAvailableToRun(show_name.title, video_title.title)
                .then(answer => {
                    speechOutput = video_title.title + " for " + show_name.title + " is " + (answer ? "available" : "not available") + " to run."
                    this.emit(":tellWithCard", speechOutput, skillName, speechOutput);
                })
                .catch(err => {
                    console.error(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tellWithCard', speechOutput, skillName, speechOutput);
                });
        } else if (show_name && start_date && end_date && show_name.value && start_date.value && end_date.value) {
            console.log("In get date range");
            db.getPromosForDateRange(show_name.value, start_date.value, end_date.value)
                .then(msg => {
                    // console.log(msg);
                    let xls = json2xls(msg);
                    email.send_email("theannihilator666@gmail.com", "Report", "Report for " + show_name.value + " from " + start_date.value + " to " + end_date.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':tell', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':tell', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });
        } else if (length && length.value) {
            console.log("In get by length");
            db.getAllPromosOfLength("World of Dance S1", 30)
                .then(data => {
                    console.log("Sending email for length");
                    let xls = json2xls(data);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':tell', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':tell', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });
        } else if (time_direction && show_name && time_direction.value && show_name.value) {
            console.log("In last night airings");
            console.log(time_direction.value + ", " + show_name.value);
            db.getPromosFromLastNight(show_name.value)
                .then(promos => {
                    if (promos.length == 0)
                        speechOutput = "There aren't any promos that ran last night"
                    else {
                        let xls = json2xls(promos);
                        email.send_email("theannihilator666@gmail.com", "Report", "Report for " + show_name.value + " from " + start_date.value + " to " + end_date.value, xls)
                            .then(res => {
                                const promo_titles = promos.map(item => {
                                    return item.Video_Title;
                                });

                                speechOutput = promo_titles.join(', ');
                                this.emit(':tell', speechOutput);
                                // speechOutput = "Check your email for the report";
                                // this.emit(':tell', speechOutput);
                            })
                            .catch(err => {
                                console.error(err);
                                speechOutput = "Something went wrong."
                                this.emit(':tell', speechOutput);
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });

        } else if (air_date && air_date.value) {
            console.log("In what ran on air on " + air_date.value);
            db.getPromosOnDate(air_date.value)
                .then(promos => {
                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':tell', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':tell', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });


        } else if (show_name && show_name.value) {
            console.log("In get all titles");
            db.getAllAvailablePromoTitlesForShow(show_name.value)
                .then(promos => {
                    const promo_titles = promos.map(item => {
                        return item['PROMO_TITLE'];
                    });

                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':tell', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':tell', speechOutput);
                        });
                })
                .catch(err => {
                    console.error(err);
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });
        } else if (video_title && video_title.value) {
            console.log("In get last aired");
            db.getLastAired(video_title.value)
                .then(air_date => {
                    console.log(air_date);
                    speechOutput = (air_date != 'n/a') ? (video_title.value + " last time aired on " + air_date) : ("There isn't any air information for " + video_title.value);
                    this.emit(':tell', speechOutput);
                })
                .catch(err => {
                    speechOutput = "Something went wrong."
                    this.emit(':tell', speechOutput);
                });
        } else {
            speechOutput = "Something went wrong.";
            this.emit(':tell', speechOutput);
        }
    },
    "OnAirPromoListingIntent": function() {
        let speechOutput = "";

        // let returnedContent = {
        //     text: "Sorry, something went wrong. Try again later.",
        //     shouldEndSession: true
        // };
        const show_name = this.event.request.intent.slots.ShowName;

        if (show_name && show_name.value) {
            db.getAiringsDuringShow(show_name.value)
                .then(promos => {
                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':tell', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':tell', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong.";
                    this.emit(':tell', speechOutput);
                });
        } else {
            speechOutput = "Something went wrong.";
            this.emit(':tell', speechOutput);
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
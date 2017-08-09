/*
    Quick sample for the Amazon Alexa RedCarpet skill app
*/
'use strict';

const Alexa = require('alexa-sdk');
const db = require('./db_util');

let email = require('./send_email');
let json2xls = require('json2xls');

const APP_ID = 'amzn1.ask.skill.4d1be70c-04e7-4383-9782-4cbe16a10659';

const skillName = "NBC Universal's Promo Skill";

let handlers = {
    "DigitalPromoIntent": function() {
        let speechOutput = "";

        const time_direction = this.event.request.intent.slots.TimeDirection;
        const video_title = this.event.request.intent.slots.PromoName;
        const show_name = this.event.request.intent.slots.ShowName;
        const start_date = this.event.request.intent.slots.StartDate;
        const end_date = this.event.request.intent.slots.EndDate;
        const length = this.event.request.intent.slots.Length;
        const air_date = this.event.request.intent.slots.AirDate;

        // {TimeDirection} did {PromoName} run?
        if (time_direction && video_title && time_direction.value && video_title.value) {
            db.getPromo(video_title.value).then((promo) => {
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
                    this.emit(':ask', speechOutput);
                })
                .catch(err => {
                    if (err) {
                        console.log(err);
                        speechOutput = "Error with promise";
                        this.emit(':ask', speechOutput);
                    }
                });
        }
        // Is the {PromoName} for {ShowName} available to run now?
        else if (video_title && show_name && video_title.value && show_name.value) {
            console.log(show_name.value + " | " + video_title.value);
            db.checkIfPromoIsAvailableToRun(show_name.value, video_title.value)
                .then(answer => {
                    speechOutput = video_title.value + " for " + show_name.value + " is " + (answer ? "available" : "not available") + " to run."
                    this.emit(":ask", speechOutput);
                })
                .catch(err => {
                    console.error(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });
        }
        // What promos aired for {ShowName} from {StartDate} to {EndDate}?
        else if (show_name && start_date && end_date && show_name.value && start_date.value && end_date.value) {
            db.getPromosForDateRange(show_name.value, start_date.value, end_date.value)
                .then(msg => {
                    let xls = json2xls(msg);
                    email.send_email("theannihilator666@gmail.com", "Report", "Report for " + show_name.value + " from " + start_date.value + " to " + end_date.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });
        }
        // Give me all promo airings from last night for {ShowName}. 
        else if (time_direction && show_name && time_direction.value && show_name.value) {
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
                                this.emit(':ask', speechOutput);
                            })
                            .catch(err => {
                                console.error(err);
                                speechOutput = "Something went wrong."
                                this.emit(':ask', speechOutput);
                            });
                    }
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });

        }
        // What ran on air on {AirDate}?
        else if (air_date && air_date.value) {
            db.getPromosOnDate(air_date.value)
                .then(promos => {
                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });


        }
        // What {ShowName} promos are available to run right now?    
        else if (show_name && show_name.value) {
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
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.error(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });
        }
        // When was the last time {PromoName} aired?
        else if (video_title && video_title.value) {
            db.getLastAired(video_title.value)
                .then(air_date => {
                    console.log(air_date);
                    speechOutput = (air_date != 'n/a') ? (video_title.value + " last time aired on " + air_date) : ("There isn't any air information for " + video_title.value);
                    this.emit(':ask', speechOutput);
                })
                .catch(err => {
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });
        } else {
            speechOutput = "Something went wrong.";
            this.emit(':ask', speechOutput);
        }
    },
    "OnAirPromoListingIntent": function() {
        let speechOutput = "";
        const show_name = this.event.request.intent.slots.ShowName;
        // Give me every promo for {show_name} that ran last week.
        if (show_name && show_name.value) {
            db.getAiringsDuringShow(show_name.value)
                .then(promos => {
                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong.";
                    this.emit(':ask', speechOutput);
                });
        } else {
            speechOutput = "Something went wrong.";
            this.emit(':ask', speechOutput);
        }
    },
    "ShowLengthIntent": function() {
        let speechOutput = "";

        const show_name = this.event.request.intent.slots.ShowName;
        const length = this.event.request.intent.slots.Length;
        // Show me all the {Length} second promos available to run for {ShowName}.
        if (length && length.value && show_name && show_name.value) {
            console.log("In get by length");
            db.getAllPromosOfLength(show_name.value, length.value)
                .then(data => {
                    console.log("Sending email for length");
                    let xls = json2xls(data);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong."
                    this.emit(':ask', speechOutput);
                });
        }
        // Show me the length of promos for {show_name}.    
        else if (show_name && show_name.value) {
            db.getLengthOfPromosForShow(show_name.value)
                .then(promos => {
                    let xls = json2xls(promos);
                    email.send_email("theannihilator666@gmail.com", "Report", "Attached is the report for " + show_name.value, xls)
                        .then(res => {
                            speechOutput = "Check your email for the report";
                            this.emit(':ask', speechOutput);
                        })
                        .catch(err => {
                            console.error(err);
                            speechOutput = "Something went wrong."
                            this.emit(':ask', speechOutput);
                        });
                })
                .catch(err => {
                    console.log(err);
                    speechOutput = "Something went wrong.";
                    this.emit(':ask', speechOutput);
                });
        } else {
            speechOutput = "Something went wrong.";
            this.emit(':ask', speechOutput);
        }
    },
    "AboutIntent": function() {
        let speechOutput = "The Promo Skill is a property of NBC Universal and shouldn't be redistributed";
        this.emit(':ask', speechOutput);
    },

    "AMAZON.HelpIntent": function() {
        let speechOutput = "";
        speechOutput += "Here are some things you can say: ";
        speechOutput += "When did outsider run? ";
        speechOutput += "What American Ninja Warrior promos are available to run right now? ";
        speechOutput += "Give me all the promos that aired during the french open. ";
        speechOutput += "So how can I help?";
        this.emit(':ask', speechOutput, speechOutput);
    },

    "AMAZON.StopIntent": function() {
        let speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    "AMAZON.CancelIntent": function() {
        let speechOutput = "Goodbye";
        this.emit(':tell', speechOutput);
    },

    'Unhandled': function() {
        this.emit(':ask', 'I can\'t find that intent');
    },

    "LaunchRequest": function() {
        let speechText = "";
        speechText += "Welcome to " + skillName + ".  ";
        let repromptText = "For instructions on what you can say, please say help me.";
        this.emit(':ask', speechText, repromptText);
    }

};

exports.handler = function(event, context) {
    let alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
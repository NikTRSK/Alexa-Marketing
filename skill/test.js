let db = require('./db_util.js')
    // let email = require('emailjs');

// console.log("Testing getPromo")
// db.getPromo("outsider").then((res) => {
//     console.log(res);
//     console.log(res[0]);
// }).catch(err => {
//     console.log(err);
// })



// db.getAllAvailablePromoTitlesForShow("American Ninja Warrior S9").then((res) => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })

// console.log("Testing getAllAvailablePromosForShow");
// db.getAllAvailablePromosForShow("Midnight Texas").then((res) => {
//     console.log(res);
// }).catch(err => { console.log(err) });

// db.checkIfPromoIsAvailableToRun("American Ninja Warrior S9", "Emmy Nom")
//     .then(data => { console.log(data); })
//     .catch(err => { console.error(err); });

// db.getPromosForDateRange("wall", "6/17/2017", "7/17/2017")
//     .then(msg => {
//         console.log(msg);
//         // let xls = json2xls(msg);
//         // email.send_email("theannihilator666@gmail.com", "Report", "This is a test", xls);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// const isBetweenDates = function(target, start, end) {
//     return target >= start && target <= end;
// }

// let d = new Date('2017-07-13 00:00:00');
// console.log(typeof d);

// let s = new Date('6/17/2017');
// let e = new Date('7/17/2017');

// console.log(isBetweenDates(d, s, e));

// email.send_email("theannihilator666@gmail.com", "Report", "This is a test", null)
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)});

// db.getAllPromosOfLength("World of Dance", 30)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// db.getPromosFromLastNight("Marlon")
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// db.getPromosOnDate("6 / 17 / 2017")
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// db.getAiringsDuringShow("FRENCH OPEN")
//     .then(promos => {
//         console.log(promos);
//     })
//     .catch(err => {
//         console.log(err);
//     });

db.getLastAired("heroes")
    .then(air_date => {
        console.log(air_date);
        speechOutput = (air_date != 'n/a') ? (video_title.value + " last time aired on " + air_date) : ("There isn't any air information for " + video_title.value);
        this.emit(':tell', speechOutput);
    })
    .catch(err => {
        speechOutput = "Something went wrong."
        this.emit(':tell', speechOutput);
    });
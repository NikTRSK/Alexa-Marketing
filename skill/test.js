let db = require('./db_util.js')
    // let email = require('emailjs');

console.log("Testing getPromo")
    // db.getPromo("outsider").then((res) => {
    //     console.log(res);
    //     console.log(res[0]);
    //     console.log(res[0]['Digital_Platform'])
    // }).catch(err => {
    //     console.log(err);
    // })

// db.getAllAvailablePromoTitlesForShow("American Ninja Warrior S9").then((res) => {
//     console.log(res);
// }).catch(err => {
//     console.log(err);
// })

// console.log("Testing getAllAvailablePromosForShow");
// db.getAllAvailablePromosForShow("Midnight Texas S1").then((res, err) => {
//     console.log(res);
// });

// db.checkIfPromoIsAvailableToRun("American Ninja Warrior S9", "Emmy Nom")
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.error(err);
//     });
// var email 	= require("./path/to/emailjs/email");
// let server = email.server.connect({
//     user: "alexa.skill.mailer@gmail.com",
//     password: "Cq365LZVvjjn",
//     host: "smtp.gmail.com",
//     ssl: true
// });

// send the message and get a callback with an error or details of the message that was sent 
// server.send({
//     text: "i hope this works",
//     from: "NBCU Promo Skill <alexa.skill.mailer@gmail.com>",
//     to: "Nikica Trajkovski <theannihilator666@gmail.com>",
//     subject: "testing emailjs"
// }, (err, message) => {
//     console.log(err || message);
// });

let email = require('./send_email');
// email.send_email("Test msg", "test sbj")
//     .then(msg => {
//         console.log("Sucess");
//     })
//     .catch(err => {
//         console.log("err");
//     })
let json2xls = require('json2xls');

// db.getPromosForDateRange("the wall", "6/17/2017", "7/17/2017")
//     .then(msg => {
//         // console.log(msg);
//         let xls = json2xls(msg);
//         email.send_email("theannihilator666@gmail.com", "Report", "This is a test", xls);
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

// email.send_email("theannihilator666@gmail.com", "Report", "This is a test", null);

// db.getAllPromosOfLength("World of Dance S1", 30)
//     .then(data => {
//         console.log(data);
//     })
//     .catch(err => {
//         console.log(err);
//     });

// db.getPromosFromLastNight("Marlon S1")
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

db.getAiringsDuringShow("FRENCH OPEN")
    .then(promos => {
        console.log(promos);
    })
    .catch(err => {
        console.log(err);
    });
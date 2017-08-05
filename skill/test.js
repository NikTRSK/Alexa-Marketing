let db = require('./db_util.js')

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

db.checkIfPromoIsAvailableToRun("American Ninja Warrior S9", "Emmy Nom")
    .then(data => {
        console.log(data);
    })
    .catch(err => {
        console.error(err);
    });
let db = require('./db_util.js')

console.log("Testing getPromo")
db.getPromo("outsider").then((res, err) => {
    console.log(res);
})

// console.log("Testing getAllAvailablePromosForShow");
// db.getAllAvailablePromosForShow("Midnight Texas S1").then((res, err) => {
//     console.log(res);
// });
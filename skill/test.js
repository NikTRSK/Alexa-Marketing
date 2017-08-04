let db = require('./db_util.js')

console.log("Testing getPromo")
db.getPromo("outsider").then((res) => {
    console.log(res);
    console.log(res[0]);
    console.log(res[0]['Digital_Platform'])
}).catch(err => {
    console.log(err);
})

// console.log("Testing getAllAvailablePromosForShow");
// db.getAllAvailablePromosForShow("Midnight Texas S1").then((res, err) => {
//     console.log(res);
// });
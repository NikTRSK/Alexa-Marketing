'use strict';

let AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-1"
});
let docClient = new AWS.DynamoDB.DocumentClient();

const isBetweenDates = function(target, start, end) {
    return target >= start && target <= end;
}

exports.getPromo = function(promo_name) {
    return new Promise((resolve, reject) => {
        let params = { TableName: "promo_data" };

        console.log("Scanning for " + promo_name);
        // console.log(promo_name);
        docClient.scan(params, onScan);
        function onScan(err, data) {
            if (err) {
                reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                const search_results = data.Items.filter(item => {
                    return item['VIDEO_TITLE'].toLowerCase() == promo_name.toLowerCase();
                });

                resolve(search_results);
            }
        }
    })
};

exports.getAllAvailablePromosForShow = function(show_name) {
    return new Promise((resolve, reject) => {
        let params = { TableName: "promo_data" };
        docClient.scan(params, onScan);
        function onScan(err, data) {
            if (err) {
                reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
				console.log("Scan succeeded.");
				const promos = data.Items.filter(item => {
					return item['SHOW_TITLE'].toLowerCase().includes(show_name.toLowerCase());
				});
                const live_promos = promos.filter(item => {
                    return item['STATUS'] == 'Live';
                });
                resolve(live_promos);
            }
        }
    })
};

exports.getAllAvailablePromoTitlesForShow = function(show_name) {
    return new Promise((resolve, reject) => {
        this.getAllAvailablePromosForShow(show_name)
            .then(promos => {
                resolve(promos);
            })
            .catch(err => {
                reject(err);
            })
    })
}

exports.checkIfPromoIsAvailableToRun = function(show_name, promo_title) {
    return new Promise((resolve, reject) => {
        this.getAllAvailablePromosForShow(show_name)
            .then(promos => {
                for (let i in promos) {
                    if (promos[i]['PROMO_TITLE'].toLowerCase() == promo_title.toLowerCase())
                        resolve(true);
                }
                resolve(false);
            })
            .catch(err => {
                reject(err);
            });
    });
}

exports.getPromosForDateRange = function(show_name, start_data, end_date) {
    return new Promise((resolve, reject) => {
        let params = { TableName: "promo_data" };

        console.log("Scanning NPT table for " + show_name);
        // console.log(promo_name);
        docClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                let search_results = data.Items.filter(item => {
                    return item['NEYWORK'] == 'NBC';
                });

                search_results = search_results.filter(item => {
                    return (item['PROMO_TITLE']).toLowerCase().includes(show_name.toLowerCase());
                });

                const start = new Date(start_data);
                const end = new Date(end_date);
                search_results = search_results.filter(item => {
                    return isBetweenDates(new Date(item['AIR_DATE']), start, end);
                });

                resolve(search_results);
            }
        }
    })
}

exports.getAllPromosOfLength = function(show_name, length) {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: "promo_data",
            KeyConditionExpression: "#show_name = :SHOW_TITLE",
            ExpressionAttributeNames: {
                "#show_name": "SHOW_TITLE"
            },
            ExpressionAttributeValues: {
                ":SHOW_TITLE": show_name
            }
        };

        console.log("Scanning VCD table for " + show_name);

        docClient.query(params, function(err, data) {
            if (err) {
                reject("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                const same_length_promos = data.Items.filter(item => {
                    return item['PROMO_LENGTH'] = length;
                });
                // console.log(live_promos);
                resolve(same_length_promos);
            }
        });
    })
};

exports.getLastAired = function(promo_name) {
    return new Promise((resolve, reject) => {
        this.getPromo(promo_name)
            .then(promo => {
                resolve(promo['AIR_DATE']);
            })
            .catch(err => {
                reject(err);
            })
    })
};

exports.getPromosFromLastNight = function(show_name) {
    return new Promise((resolve, reject) => {
        let last_night = new Date("6/28/2017"); // Change to get yesterday's date
        const params = {
            TableName: "promo_data",
            KeyConditionExpression: "#show_name = :SHOW_TITLE",
            ExpressionAttributeNames: {
                "#show_name": "SHOW_TITLE"
            },
            ExpressionAttributeValues: {
                ":SHOW_TITLE": show_name
            }
        };

        console.log("Scanning VCD table for " + show_name);

        docClient.query(params, function(err, data) {
            if (err) {
                reject("Unable to query. Error:", JSON.stringify(err, null, 2));
            } else {
                console.log("Query succeeded.");
                const promos = data.Items.filter(item => {
                    return (new Date(item['AIR_DATE']).getTime() == last_night.getTime());
                });
                // console.log(live_promos);
                resolve(promos);
            }
        });
    });
};

exports.getPromosOnDate = function(air_date) {
    air_date = new Date(air_date);
    return new Promise((resolve, reject) => {
        let params = { TableName: "promo_data" };

        docClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                const search_results = data.Items.filter(item => {
                    console.log(item['AIR_DATE']);
                    return new Date(item['AIR_DATE']).getTime() == air_date.getTime();
                });

                resolve(search_results);
            }
        }
    })
}

exports.getAiringsDuringShow = function(show_name) {
    return new Promise((resolve, reject) => {
        let params = { TableName: "promo_data" };

        docClient.scan(params, onScan);

        function onScan(err, data) {
            if (err) {
                reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Scan succeeded.");
                const search_results = data.Items.filter(item => {
                    return item['SHOW_TITLE'].toLowerCase().includes(show_name.toLowerCase());
                });

                resolve(search_results);
            }
        }
    })
}
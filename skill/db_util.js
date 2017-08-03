'use strict';

let AWS = require("aws-sdk");
AWS.config.update({
	region: "us-east-1"
});
let docClient = new AWS.DynamoDB.DocumentClient();

exports.getPromo = function(promo_name) {
	let params = { TableName: "vcd_data" };

	console.log("Scanning VCD table for " + promo_name);
	docClient.scan(params, onScan);

	function onScan(err, data) {
		if (err) {
			console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
		} else {
			console.log("Scan succeeded.");
			const search_results = data.Items.filter(item => {
				return item['Video Title'].toLowerCase() == promo_name.toLowerCase();
			});
			
			return search_results;
		}
	}
};

exports.getAllAvailablePromosForShow = function(show_name) {
	let params = {
		TableName: "vcd_data",
		KeyConditionExpression: 'Show Name' = show_name };

	console.log("Scanning VCD table for " + show_name);
	// docClient.scan(params, onScan);

	// function onScan(err, data) {
	// 	if (err) {
	// 		console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
	// 	} else {
	// 		console.log("Scan succeeded.");
	// 		const search_results = data.Items.filter(item => {
	// 			return item['Show Name'].toLowerCase() == show_name.toLowerCase() && item['Status'] == 'Live';
	// 		});
			
	// 		return search_results;
	// 	}
	// }

	// return null;

	
// var params = {
//     TableName : "Movies",
//     ProjectionExpression:"#yr, title, info.genres, info.actors[0]",
//     KeyConditionExpression: "#yr = :yyyy and title between :letter1 and :letter2",
//     ExpressionAttributeNames:{
//         "#yr": "year"
//     },
//     ExpressionAttributeValues: {
//         ":yyyy":1992,
//         ":letter1": "A",
//         ":letter2": "L"
//     }
// };

docClient.query(params, function(err, data) {
    if (err) {
        console.log("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {

		console.log("Query succeeded.");
		console.log(data.Items);
        // data.Items.forEach(function(item) {
        //     console.log(" -", item.year + ": " + item.title
        //     + " ... " + item.info.genres
        //     + " ... " + item.info.actors[0]);
        // });
    }
});
};
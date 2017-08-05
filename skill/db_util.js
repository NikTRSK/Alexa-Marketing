'use strict';

let AWS = require("aws-sdk");
AWS.config.update({
	region: "us-east-1"
});
let docClient = new AWS.DynamoDB.DocumentClient();

exports.getPromo = function(promo_name) {
	return new Promise((resolve, reject) => {
		let params = { TableName: "vcd_data" };

		console.log("Scanning VCD table for " + promo_name);
		console.log(promo_name);
		docClient.scan(params, onScan);

		function onScan(err, data) {
			if (err) {
				reject("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
			} else {
				console.log("Scan succeeded.");
				const search_results = data.Items.filter(item => {
					return item['Video_Title'].toLowerCase() == promo_name.toLowerCase();
				});
				
				resolve(search_results);
			}
		}
	})
};

exports.getAllAvailablePromosForShow = function(show_name) {
	return new Promise((resolve, reject) => {
		const params = {
			TableName: "vcd_data",
			KeyConditionExpression: "#show_name = :Show_Name",
			ExpressionAttributeNames: {
				"#show_name": "Show_Name"
			},
			ExpressionAttributeValues: {
				":Show_Name": show_name
			}
		};

		console.log("Scanning VCD table for " + show_name);

		docClient.query(params, function(err, data) {
			if (err) {
				reject ("Unable to query. Error:", JSON.stringify(err, null, 2));
			} else {
				console.log("Query succeeded.");
				const live_promos = data.Items.filter(item => {
					return item.Status = 'Live'
				});
				// console.log(live_promos);
				resolve (live_promos);
			}
		});
	})
};

exports.getAllAvailablePromoTitlesForShow = function(show_name) {
	return new Promise((resolve, reject) => {
		this.getAllAvailablePromosForShow(show_name)
		.then(promos => {
			const promo_titles = promos.map(item => {
				return item.Video_Title;
			});
			resolve(promo_titles);
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
				if (promos[i].Video_Title.toLowerCase() == promo_title.toLowerCase())
					resolve(true);
			}
			resolve(false);
		})
		.catch(err => {
			reject(err);
		});
	});
}
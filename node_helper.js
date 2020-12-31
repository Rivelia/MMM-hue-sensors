/* Magic Mirror
 * Module: hue-sensors
 *
 * By Baptiste Michel
 * MIT Licensed.
 */
var NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({
	start: function () {
		console.log('MMM-hue-sensors: started'); /*eslint-disable-line*/
	},

	getSensors: function (url) {
		request({ url: url, method: 'GET' }, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				this.sendSocketNotification('SENSORS_RESULT', JSON.parse(body));
			}
		});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'GET_SENSORS') {
			this.getSensors(payload);
		}
	},
});

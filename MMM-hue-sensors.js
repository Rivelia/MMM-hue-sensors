/* Magic Mirror
 * Module: hue-sensors
 *
 * By Baptiste Michel
 * MIT Licensed.
 */
'use strict';

Module.register('MMM-hue-sensors', {
	result: [],
	// Default module config.
	defaults: {
		bridgeApiUrl: 'http://YOUR_BRIDGE_IP/api',
		userId: 'YOUR_AUTHORIZED_USER_ID',
		updateInterval: 60000,
	},

	getStyles: function () {
		return ['hue-sensors.css'];
	},

	start: function () {
		this.getSensors();
		this.scheduleUpdate();
		this.result = null;
	},

	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement('div');

		if (!this.result) {
			wrapper.className = 'bright small light';
			wrapper.innerHTML = 'LOADING';
		} else {
			wrapper.className = 'small';
			//<thead class="hue-sensors-header"><tr><td><span class="fa fa-signature"></span></td><td><span class="fa fa-thermometer-half"></span></td><td><span class="fa fa-battery-half"></span></td></tr></thead>
			let s = '<table class="hue-sensors-table"><tbody>';
			for (let id in this.result) {
				let sensor = this.result[id];

				if (sensor.type === 'ZLLPresence') {
					let name = sensor.name.replace(' sensor', '');
					let battery = sensor.config.battery;
					let isReachable = sensor.config.reachable;
					// let ZLLLightLevel = this.result[
					// 	(parseInt(id) + 1).toString()
					// ];
					let ZLLTemperature = this.result[
						(parseInt(id) + 2).toString()
					];
					let temperature = ZLLTemperature.state.temperature / 100;

					s += `<tr><td class="hue-sensors-name hue-sensors-${
						isReachable ? 'reachable' : 'unreachable'
					}">${name}</td><td class="hue-sensors-temperature">${temperature.toFixed(
						1
					)}°</td><td class="hue-sensors-battery">${battery}%</td></tr>`;
				}
			}
			s += '</tbody></table>';
			wrapper.innerHTML = s;
		}

		return wrapper;
	},

	scheduleUpdate: function (delay) {
		let nextLoad = this.config.updateInterval;
		if (typeof delay !== 'undefined' && delay >= 0) {
			nextLoad = delay;
		}

		setInterval(() => {
			this.getSensors();
		}, nextLoad);
	},

	getSensors: function () {
		this.sendSocketNotification(
			'GET_SENSORS',
			`${this.config.bridgeApiUrl}/${this.config.userId}/sensors`
		);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === 'SENSORS_RESULT') {
			this.result = payload;
			this.updateDom(this.config.fadeSpeed);
		}
	},
});

/**
 * Info
 * Cassius - https://github.com/sirDonovan/Cassius
 *
 * This file contains informational commands for Cassius.
 *
 * @license MIT license
 */

'use strict';

let commands = {
	about: function (target, room, user) {
		if (room !== user && !user.hasRank(room, '+')) return;
		this.say(Config.username + " code by CheeseMuffin, originally from sirDonovan: https://github.com/CheeseMuffin/Cassius");
	},
};

exports.commands = commands;

'use strict';

const name = "Count";
const description = "Players try to count to the next number without failing! **Command:** ``" + Config.commandCharacter + "count [number]``";
const id = Tools.toId(name);
class Count extends Games.Minigame {
	constructor(room) {
		super(room);
		this.name = name;
		this.points = new Map();
		this.id = Tools.toId(name);
		this.curCount = 0;
		this.started = true;
		this.freeJoin = true;
		this.description = description;
	}

	count(target, user) {
		this.addPlayer(user);
		let x = Math.floor(Tools.toId(target));
		let player = this.players[user.id];
		if (x === (this.curCount + 1)) {
			let points = this.points.get(player) || 0;
			points++;
			this.points.set(player, points);
			this.curCount++;
			if (this.curCount === 101) {
				Games.addChieve("Count Dracula", player.name);
			}
		} else {
			this.room.say(user.name + " counted incorrectly!");
			for (let userID in this.players) {
				let player = this.players[userID];
				let points = this.points.get(player) || 0;
				if (userID === user.id) {
					player.say("You counted incorrectly, and so lost " + 25 * (this.curCount - points) + " bits!");
					this.addBits(25 * (this.curPoints - points), player, this.room.id);
				} else {
					player.say("You earned " + 25 * points + " bits!");
					Storage.addPoints(25 * points, player, this.room.id);
				}
			}
			this.end();
		}
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Count;
exports.aliases = [];
exports.minigame = true;
'use strict';

const name = "Ponyta's Pinata Party";
const id = Tools.toId(name);
const description = "Players try to hit the pinata before it explodes! **Command:** ``" + Config.commandCharacter + "hit``";

class Ponyta extends Games.Game {
	constructor(room) {
		super(room);
		this.id = id;
		this.name = name;
		this.description = description;
		this.points = new Map();
		this.freeJoin = true;
		this.num = 0;
		this.canHit = false;
		this.hits = new Map();
	}

	onSignups() {
		this.timeout = setTimeout(() => this.nextRound(), 10 * 1000);
	}

	onNextRound() {
		if (this.round === 11) {
			this.say("All Piñatas have been broken!");
			let maxPoints = -1;
			let bestPlayers = [];
			for (let userID in this.players) {
				let player = this.players[userID];
				let points = this.points.get(player);
				if (!points) continue;
				if (points > maxPoints) {
					bestPlayers = [player.name];
					maxPoints = points;
				} else if (points === maxPoints) {
					bestPlayers.push(player.name);
				}
			}
			if (bestPlayers.length === 0) {
				this.say("Nobody hit any Piñatas this game!");
			} else {
				this.say("**Winners:** " + bestPlayers.join(", "));
			}
			this.end();
			return;
		}
		this.hits.clear();
		this.num = 0;
		this.say("**Round " + this.round + "!** ");
		this.say("The Piñata has appeared!");
		let num1 = Math.floor(Math.random() * 6) + 1;
		let num2 = Math.floor(Math.random() * 6) + 1;
		this.canHit = true;
		this.timeout = setTimeout(() => this.explodePinata(), (num1 + num2) * 1000);
	}

	explodePinata() {
		this.say("The Piñata broke!");
		this.canHit = false;
		if (this.num === 0) {
			this.say("Nobody hit the Piñata this round!");
		} else {
			for (let userID in this.players) {
				let player = this.players[userID];
				let hitNum = this.hits.get(player);
				if (!hitNum) continue;
				let points = this.points.get(player) || 0;
				let gain = Math.floor(50 * hitNum / this.num);
				this.points.set(player, points + gain);
				player.say("You earned " + gain + " points this round!");
			}
		}
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	hit(target, user) {
		if (!this.canHit) return;
		if (!(user.id in this.players)) this.addPlayer(user);
		let player = this.players[user.id];
		if (this.hits.has(player)) return;
		this.hits.set(player, this.num + 1);
		this.num++;
	}
}

exports.name = name;
exports.id = id;
exports.description = description;
exports.game = Ponyta;
exports.aliases = ["ppp"];
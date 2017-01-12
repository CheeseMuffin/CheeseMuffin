'use strict';

const name = "Lottery Roulette";
const description = "http://s15.zetaboards.com/PS_Game_Corner/topic/10053608/1/#new";
const id = Tools.toId(name);

class LotteryRoulette extends Games.Game {
	constructor(room) {
		super(room);
		this.name = name;
		this.description = description;
		this.id = id;
		this.wagers = new Map();
		this.attacks = new Map();
	}

	onStart() {
		this.say("Please wager your bits! **Command:** ``" + Config.commandCharacter + "wager [bits]``");
		this.canWager = true;
		this.timeout = setTimeout(() => this.handleWagers(), 30 * 1000);
	}

	handleWagers() {
		this.canWager = false;
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!this.wagers.has(player)) this.wagers.set(player, 10);
		}
		this.nextRound();
	}

	onNextRound() {
		if (this.getRemainingPlayerCount() === 1) {
			let players = this.getRemainingPlayers();
			let winner = players[Object.keys(players)[0]];
			this.say("**Winner:** " + winner.name);
			this.end();
			return;
		}
		this.attacks.clear();
		this.say("Please select your victim! **Command:** ``" + Config.commandCharacter + "select [user]``");
		this.timeout = setTimeout(() => this.chooseVictim(), 30 * 1000);
	}

	chooseVictim() {
		let multiplier = 1 + this.round / this.playerCount;
		let remainPlayers = this.getRemainingPlayers();
		let elimPlayer = remainPlayers[Tools.sample(Object.keys(remainPlayers))];
		this.say(elimPlayer.name + " was randomly chosen to be eliminated!");
		elimPlayer.eliminated = true;
		let num = 1;
		for (let userID in remainPlayers) {
			let player = remainPlayers[userID];
			if (player === elimPlayer) continue;
			let guessedPlayer = this.attacks.get(player);
			if (!guessedPlayer || guessedPlayer !== elimPlayer) continue;
			let wager = this.wagers.get(player);
			this.addBits(Math.floor(wager * multiplier), player);
			player.say("You earned " + Math.floor(wager * multiplier) + " bits for guessing the eliminated player correctly!");
			num++;
		}
		let wager = this.wagers.get(elimPlayer);
		this.removeBits(wager * num, elimPlayer);
		elimPlayer.say("You lost " + (wager * num) + " bits for being eliminated.");
		elimPlayer.eliminated = true;
		this.timeout = setTimeout(() => this.nextRound(), 5 * 1000);
	}

	select(target, user) {
		let attackingPlayer = this.players[user.id];
		if (!attackingPlayer || attackingPlayer.eliminated || this.attacks.get(attackingPlayer)) return;
		let attackedPlayer = this.players[Tools.toId(target)];
		if (!attackedPlayer || attackedPlayer.eliminated) return;
		console.log('hi3');
		this.attacks.set(attackingPlayer, attackedPlayer);
		user.say("You have selected **" + attackedPlayer.name + "**!");
	}

	wager(target, user) {
		if (!this.canWager) return;
		let player = this.players[user.id];
		if (!player || player.eliminated || this.wagers.has(player)) return;
		target = Math.floor(target);
		if (!target || target < 0) return;
		let curBits = 10;
		if (user.id in Storage.databases[this.room.id].leaderboard) {
			curBits = Storage.databases[this.room.id].leaderboard[user.id].points;
		}
		if (target > curBits) target = curBits;
		if (target > 500) target = 500;
		this.wagers.set(player, target);
		user.say("Your wager for " + target + " bits has been placed!");
	}
}

exports.game = LotteryRoulette;
exports.name = name;
exports.description = description;
exports.id = id;
exports.aliases = ['lr'];
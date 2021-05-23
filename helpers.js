const mongoose = require('mongoose');
const Player = require('./models/player');

module.exports.calculateAvg = async (playerID) => {
	const player = await Player.findById(playerID);
	if (player.atBats) {
		const avg = player.hits / player.atBats;
		await player.updateOne({ battingAverage: avg });
		await player.save();
		return;
	}
	return 0;
};

module.exports.calculateOBP = async (playerID) => {
	const player = await Player.findById(playerID);
	if (player.atBats || player.walks) {
		const obp = (player.hits + player.walks) / (player.atBats + player.walks);
		await player.updateOne({ onBasePercentage: obp });
		await player.save();
		return;
	}
	return 0;
};

module.exports.calculateSLG = async (playerID) => {
	const player = await Player.findById(playerID);
	if (player.atBats) {
		const slg = (player.single + player.double * 2 + player.triple * 3 + player.homeRun * 4) / player.atBats;
		await player.updateOne({ sluggingPercentage: slg });
		await player.save();
		return;
	}
	return 0;
};

module.exports.calculateOPS = async (playerID) => {
	const player = await Player.findById(playerID);
	if (player.atBats) {
		const ops = player.onBasePercentage + player.sluggingPercentage;
		await player.updateOne({ ops: ops });
		await player.save();
		return;
	}
	return 0;
};

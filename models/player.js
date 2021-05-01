const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlayerSchema = new Schema({
	firstName          : {
		type     : String,
		required : true
	},
	lastName           : {
		type     : String,
		required : true
	},
	atBats             : {
		type     : Number,
		required : true,
		default  : 0
	},
	hits               : {
		type     : Number,
		required : true,
		default  : 0
	},
	walks              : {
		type     : Number,
		required : true,
		default  : 0
	},
	runs               : {
		type     : Number,
		required : true,
		default  : 0
	},
	strikeouts         : {
		type     : Number,
		required : true,
		default  : 0
	},
	single             : {
		type     : Number,
		required : true,
		default  : 0
	},
	double             : {
		type     : Number,
		required : true,
		default  : 0
	},
	triple             : {
		type     : Number,
		required : true,
		default  : 0
	},
	homeRun            : {
		type     : Number,
		required : true,
		default  : 0
	},
	battingAverage     : {
		type : Number
		// required : true
	},
	onBasePercentage   : {
		type : Number
		// required : true
	},
	sluggingPercentage : {
		type : Number
		// required : true
	}
});

async function calculateBA (player) {
	const { atBats, hits } = player;
	player.battingAverage = hits / atBats;
}

async function calculateOBP (player) {
	const { atBats, hits, walks } = player;
	player.onBasePercentage = (hits + walks) / (atBats + walks);
}

async function caluclateSLG (player) {
	const { single, double, triple, homeRun, atBats } = player;
	player.sluggingPercentage = (single + double * 2 + triple * 3 + homeRun * 4) / atBats;
}

PlayerSchema.pre('save', async function (player) {
	await calculateBA(player);
	await calculateOBP(player);
	await caluclateSLG(player);
});

module.exports = mongoose.model('Player', PlayerSchema);
